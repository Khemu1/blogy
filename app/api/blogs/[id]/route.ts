import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/database";
import initializeBlogModel from "@/models/blog";
import initializeCommentModel from "@/models/comment";
interface Props {
  params: { id: number };
}
export async function GET(req: NextRequest, { params }: Props) {
  try {
    if (typeof Number(params.id) !== "number" || Number(params.id) < 1) {
      return new Response("Invalid ID", { status: 400 });
    }

    await connectDB();
    const Blog = await initializeBlogModel();
    const Comment = await initializeCommentModel();

    const [blog,comments] = await Promise.all([
      Blog.findByPk(params.id),
      Comment.findAll({
        where: {
          blogId: params.id,
        },
      }),
    ]);

    if (!blog) {
      return new Response("Blog Not Found", { status: 404 });
    }

    // Convert the blog instance to a plain object
    const blogData = blog.get({ plain: true });

    // Return the plain object directly in the response
    return Response.json({blogData, comments}, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return new Response("An error occurred", { status: 500 });
  }
}
