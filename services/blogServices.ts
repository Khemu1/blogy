import { sendEmail } from "@/app/api/email";
import Blog from "@/db/models/Blog";
import Comment from "@/db/models/Comment";
import User from "@/db/models/User";
import { CustomError } from "@/middlewares/error/CustomError";
import { NewBlogProp, SearchParams, updateBlogParams } from "@/app/types";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export const getBlogsParams = (req: NextRequest) => {
  const p = req.nextUrl.searchParams;
  let searchParams: SearchParams = {};
  const sorting = p.get("sortBy");

  let ordering: [string, "ASC" | "DESC"] = ["createdAt", "DESC"];
  searchParams.q = p.get("q");
  searchParams.searchBy = p.get("searchBy") as
    | "author"
    | "title"
    | "content"
    | null;

  switch (sorting) {
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
      ordering = ["createdAt", "DESC"];
  }
  return { searchParams, ordering };
};

export const getPageNumber = (req: NextRequest) => {
  const p = req.nextUrl.searchParams;
  const page = parseInt(p.get("page") ?? "1", 10);
  if (isNaN(page) || page < 1) return 1;
  return page;
};

export const getAllBlogsService = async (
  searchParams: SearchParams,
  ordering: [string, "ASC" | "DESC"],
  pageNumber: number
) => {
  try {
    // Initialize an empty object to build the search condition
    let whereClause: any = {};

    // Check if both search parameters are provided
    if (searchParams.q && searchParams.searchBy) {
      // Use the value of searchParams.searchBy as the key (e.g., "author", "title", etc.)
      // Create a search condition for the field with a case-insensitive partial match
      // Note: Brackets [] are used to dynamically access the object key
      whereClause[searchParams.searchBy] = {
        [Op.iLike]: `%${searchParams.q}%`, // `Op.iLike` is used for case-insensitive matching
      };
      // Example result if searchParams.q = 'art1' and searchParams.searchBy = 'title':
      // { title: { [Op.iLike]: '%art1%' } }
    }

    const limit = 5;

    const totalBlogs = await Blog.count({ where: whereClause });
    const blogs = await Blog.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
      limit: limit,
      offset: (pageNumber - 1) * 5, // Calculate the offset for pagination
      order: [ordering],
      attributes: {
        exclude: ["deletedAt", "userId"],
      },
    });
    const totalPages = Math.ceil(totalBlogs / limit);
    return { blogs, totalPages };
  } catch (error) {
    console.log("error while fetching all blogs", error);
    throw error;
  }
};

export const addBlogService = async (blog: NewBlogProp, userId: number) => {
  try {
    if (isNaN(userId) || userId < 1) {
      throw new CustomError("invalid user id", 401, "try signing in", true);
    }
    const user = await User.findByPk(userId);
    if (!user) {
      throw new CustomError(
        "User not found",
        404,
        "Make sure that the user ID is valid and exists.",
        true
      );
    }
    const userInstance = user.get();

    const createdBlog = await Blog.create({ ...blog, userId });

    const emailBody = `Hello, ${
      userInstance.username || "Blogger"
    } your blog has been created with the title of ${blog.title} `;

    const emailSubject = "blog created";

    sendEmail(userInstance?.email, emailSubject, emailBody);
    return createdBlog.id;
  } catch (error) {
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

    if (!Comment.sequelize) {
      throw new CustomError(
        "Sequelize instance is not defined on the Comment model",
        500,
        "Ensure that the model is defined properly.",
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
      ],
    });
    const user = await User.findByPk(1);
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
    if (isNaN(blogId) || blogId < 1) {
      throw new CustomError(
        "Invalid ID",
        400,
        "Make sure that the ID is valid.",
        true
      );
    }

    const blog = await Blog.findOne({
      where: {
        id: blogId,
        userId: userId,
      },
    });
    if (!blog) {
      throw new CustomError(
        "Blog Not Found",
        404,
        "The blog post with the specified ID was not found.",
        true
      );
    }
    await blog.destroy();
  } catch (err) {
    throw err;
  }
};

export const updateBlogService = async (
  blogId: number,
  userId: number,
  blogData: updateBlogParams
) => {
  try {
    if (isNaN(blogId) || blogId < 1) {
      throw new CustomError(
        "Invalid ID",
        400,
        "Make sure that the ID is valid.",
        true
      );
    }

    const blog = await Blog.findOne({
      where: {
        id: blogId,
        userId: userId,
      },
    });
    if (!blog) {
      throw new CustomError(
        "Blog Not Found",
        404,
        "The blog post with the specified ID was not found.",
        true
      );
    }
    const newBlog = await blog.update({ ...blogData, updatedAt: new Date() });
    const {
      id,
      userId: _,
      deletedAt,
      updatedAt,
      ...modifiedBlog
    } = newBlog.get();
    return modifiedBlog;
  } catch (err) {
    throw err;
  }
};
