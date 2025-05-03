import { sendEmail } from "@/app/api/email";
import Blog from "@/db/models/Blog";
import Comment from "@/db/models/Comment";
import User from "@/db/models/User";
import { CustomError } from "@/middlewares/error/CustomError";
import { EditBlogProps, NewBlogProp, SearchParams } from "@/app/types";
import { NextRequest } from "next/server";
import { Op, Order } from "sequelize";
import Upload from "@/db/models/Upload";
import {
  deleteTempFile,
  deleteUpload,
  moveFileFromTempToUploads,
} from "./helpers/upload";
import { sanitizeData } from "@/app/utils";

export const getBlogsParams = async (req: NextRequest) => {
  const p = req.nextUrl.searchParams;
  let searchParams: SearchParams = {};
  const sorting = p.get("sortBy");
  const sanitizedData = (await sanitizeData({
    sortBy: sorting,
  })) as unknown as { sortBy: string } | null;
  let ordering: [string, "ASC" | "DESC"] = ["createdAt", "DESC"];
  searchParams.q = p.get("q");
  searchParams.searchBy = p.get("searchBy") as
    | "author"
    | "title"
    | "content"
    | null;

  switch (sanitizedData?.sortBy) {
    case "create-d-asc":
      ordering = ["createdAt", "ASC"];
      break;
    case "create-d-desc":
      ordering = ["createdAt", "DESC"];
      break;
    case "update-d-asc":
      ordering = ["updatedAt", "ASC"];
      break;
    case "update-d-desc":
      ordering = ["updatedAt", "DESC"];
      break;
    default:
      ordering = ["createdAt", "ASC"];
  }

  return { searchParams, ordering };
};

export const getPageNumber = async (req: NextRequest) => {
  const p = req.nextUrl.searchParams;
  const data = { page: p.get("page") };
  const sanitized = (await sanitizeData(data)) as unknown as {
    page: string;
  } | null;

  const page = parseInt(sanitized?.page ?? "1", 10);
  console.log("sanitized", sanitized);
  console.log("page", page);

  if (isNaN(page) || page < 1) return 1;
  return page;
};

export const getAllBlogsService = async (
  searchParams: SearchParams,
  ordering: [string, "ASC" | "DESC"],
  pageNumber: number
) => {
  try {
    let whereClause: any = {};
    let includeClause: any = [
      {
        model: User,
        attributes: ["username"],
        required: false,
      },
      {
        association: "image",
        attributes: ["id", "mimeType"],
        required: false,
      },
    ];

    if (searchParams.q && searchParams.searchBy) {
      if (searchParams.searchBy === "author") {
        includeClause[0] = {
          ...includeClause[0],
          where: {
            username: {
              [Op.iLike]: `%${searchParams.q}%`,
            },
          },
          required: true,
        };
      } else {
        whereClause[searchParams.searchBy] = {
          [Op.iLike]: `%${searchParams.q}%`,
        };
      }
    }

    const limit = 5;
    const offset = (pageNumber - 1) * limit;

    const orderClause: Order = [];

    if (ordering[0] === "username") {
      orderClause.push([
        { model: User, as: "author" },
        "username",
        ordering[1],
      ]);
    } else if (["createdAt", "updatedAt"].includes(ordering[0])) {
      orderClause.push([ordering[0], ordering[1]]);
    }
    console.log("orderClause", orderClause);
    const [totalBlogs, blogs] = await Promise.all([
      Blog.count({
        where: whereClause,
        include: includeClause,
      }),
      Blog.findAll({
        where: whereClause,
        include: includeClause,
        limit,
        offset,
        attributes: { exclude: ["deletedAt", "userId"] },
        order: orderClause,
      }),
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);
    return {
      blogs: blogs.map((blog) => ({
        ...blog.get({ plain: true }),
      })),
      totalPages,
    };
  } catch (error) {
    console.error("Error while fetching all blogs", error);
    throw error;
  }
};

export const addBlogService = async (blog: NewBlogProp, userId: number) => {
  try {
    const createdBlog = await Blog.create({
      content: blog.content,
      title: blog.title,
      userId,
    });

    if (blog.imageId) {
      console.log("We have an image for the blog");

      const res = await Upload.update(
        { blogId: createdBlog.id, isCompleted: true },
        {
          where: { id: blog.imageId },
        }
      );
      console.log("res ", res);
      if (res[0] === 0) {
        throw new CustomError("Image not found", 404);
      }
      const upload = await Upload.findByPk(blog.imageId);

      if (upload) {
        console.log("Upload found:", upload.get());
        await moveFileFromTempToUploads(upload.id, upload.mimeType);
      } else {
        console.warn("Upload record not found after update.");
      }
    }

    return createdBlog.id;
  } catch (error) {
    console.error("Error in addBlogService:", error);
    throw error;
  }
};

export const getBlogService = async (blogId: number, userId: number) => {
  try {
    if (isNaN(blogId) || blogId < 1) {
      throw new CustomError(
        "Invalid ID",
        400,
        "Make sure that the ID is valid.",
        true
      );
    }

    const commentsOrder: any[] = [["createdAt", "ASC"]];

    if (!isNaN(userId) && userId > 0) {
      commentsOrder.unshift([
        Comment.sequelize!.literal(
          `CASE WHEN "userId" = ${userId} THEN 0 ELSE 1 END`
        ),
        "ASC",
      ]);
    }
    const blogData = await Blog.findByPk(blogId, {
      include: [
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
          order: commentsOrder,
          attributes: ["id", "content"],
        },
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
        {
          association: "image",
          required: false,
        },
      ],
    });

    if (!blogData) {
      throw new CustomError(
        "Blog Not Found",
        404,
        "The blog post with the specified ID was not found.",
        true
      );
    }
    return blogData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteBlogService = async (blogId: number, userId: number) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id: blogId,
        userId: userId,
      },
      include: [
        {
          association: "image",
          required: false,
        },
      ],
    });
    const res = await Blog.destroy({
      where: {
        id: blogId,
        userId: userId,
      },
    });
    const blogImage = await Upload.findOne({
      where: { blogId: blogId },
    });
    if (blogImage) {
      await Upload.destroy({ where: { id: blogImage.id } });
      await deleteUpload(blogImage.id);
    }

    if (res === 0) {
      throw new CustomError("Blog not found", 404);
    }
  } catch (err) {
    throw err;
  }
};

export const updateBlogService = async (
  blogId: number,
  userId: number,
  blogData: EditBlogProps
) => {
  try {
    const [updatedCount] = await Blog.update(
      { title: blogData.title, content: blogData.content },
      { where: { id: blogId, userId: userId } }
    );

    if (updatedCount === 0) {
      throw new CustomError("Blog update failed or blog not found", 404);
    }
    console.log("updatedCount", blogData);
    if (blogData.image && typeof blogData.image === "string") {
      console.log("we have a new image");
      const deleted = await Upload.destroy({ where: { blogId } });
      const findImage = await Upload.findOne({
        where: { id: blogData.image },
      });
      if (!findImage) {
        throw new CustomError("Image not found for update", 404);
      }
      const [uploadUpdated] = await Upload.update(
        { isCompleted: true, blogId: blogId },
        { where: { id: blogData.image } }
      );

      if (uploadUpdated === 0) {
        throw new CustomError("Failed to update the uploaded image", 500);
      }
      moveFileFromTempToUploads(findImage.id, findImage.mimeType);
    }

    if (blogData.image === null) {
      console.log("we have a null image , deleting");
      const deleted = await Upload.destroy({ where: { blogId } });
      if (deleted === 0) {
        throw new CustomError("No image found to delete", 404);
      }
    }
  } catch (err) {
    throw err;
  }
};

export const getUserBlogsService = async (userId: number) => {
  try {
    const blogs = await Blog.findAll({
      where: { userId: userId },
      attributes: { include: ["id", "title", "userId"] },
    });
    return blogs;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getBlogForEditService = async (blogId: number, userId: number) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id: blogId,
        userId: userId,
      },
      include: [
        {
          association: "image",
          required: false,
        },
      ],
    });
    if (!blog) {
      console.log("blog for edit found ", blog);
      throw new CustomError("Blog Not Found", 404);
    }
    return blog;
  } catch (error) {
    throw error;
  }
};

export const getRandomBlogService = async () => {
  try {
    const blogs = await Blog.findAll({
      attributes: { include: ["id", "title", "userId"] },
      order: [["createdAt", "ASC"]],
      limit: 1,
    });
    return blogs;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
