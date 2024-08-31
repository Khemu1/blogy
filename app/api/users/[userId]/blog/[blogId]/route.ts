import { NextRequest } from "next/server";
import { connectDB } from "@/utils/database";
import initializeBlogModel from "@/models/blog";
interface Props {
  params: { userId: number; blogId: number };
}
export async function GET(req: NextRequest, { params }: Props) {
  try {
    if (!Number(params.blogId) || Number(params.userId)) {
      return new Response("Invalid IDasasasas", { status: 400 });
    }
    await connectDB();
    const Blog = await initializeBlogModel();
    const blogs = await Blog.findAll({
      where: { blogId: params.blogId, userId: params.userId },
    });
    if (blogs.length > 0) {
      return Response.json(blogs, { status: 200 });
    }
    return new Response("Blog Not Found", { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return new Response("An error occurred", { status: 500 });
  }
}
