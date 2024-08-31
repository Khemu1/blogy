import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/database";
import initializeBlogModel from "@/models/blog";
import initializeUserModel from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const Blog = await initializeBlogModel();
    const blogs = await Blog.findAll();
    if (blogs.length > 0) {
      return Response.json(blogs, { status: 200 });
    }
    return new Response("Blog Not Found", { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:");
    return new Response("An error occurred", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const userId = req.headers.get("X-User-Id");

    if (!userId || typeof Number(userId) !== "number") {
      console.log(userId);
      return NextResponse.json({ message: "Invalid User" }, { status: 401 });
    }

    // Your existing code to handle request data
    await connectDB();
    const Blog = await initializeBlogModel();
    const User = await initializeUserModel();
    const user = await User.findByPk(userId, {
      attributes: ["username"],
    });
    const blog = await Blog.create({
      ...data,
      userId: userId,
      author: user?.username,
    });
    let response = NextResponse.json({ blogId: blog.id }, { status: 201 });

    return response; // Ensure response includes all necessary headers and cookies
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
