import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/database";
import initializeBlogModel from "@/models/blog";
import initializeCommentModel from "@/models/comment";

interface Props {
  params: { id: number };
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const userId = Number(req.headers.get("X-User-Id"));

    if (isNaN(params.id) || params.id < 1) {
      return new Response("Invalid ID", { status: 400 });
    }

    await connectDB();
    const Blog = await initializeBlogModel();
    const Comment = await initializeCommentModel();
    if (!Comment.sequelize) {
      throw new Error("Sequelize instance is not defined on the Comment model");
    }

    const commentsOrder: any[] = [["createdAt", "ASC"]];

    // Conditionally add sorting by userId
    if (!isNaN(userId) && userId > 0) {
      commentsOrder.unshift([
        Comment.sequelize.literal(
          `CASE WHEN "userId" = ${userId} THEN 0 ELSE 1 END`
        ),
        "ASC",
      ]);
    }
    const [blog, comments] = await Promise.all([
      Blog.findByPk(params.id),
      Comment.findAll({
        where: { blogId: params.id },
        order: commentsOrder as any,
      }),
    ]);

    if (!blog) {
      return new Response("Blog Not Found", { status: 404 });
    }

    const blogData = blog.get({ plain: true });
    let response = NextResponse.json({ blogData, comments }, { status: 200 });
    response.headers.delete("X-User-Id");
    return response;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return new Response("An error occurred", { status: 500 });
  }
}
