import { initializeDatabase } from "@/config/dbInit";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import {
  deleteBlogService,
  getBlogService,
  updateBlogService,
} from "@/services/blogServices";
import { updateBlogParams } from "@/types";
import { NextRequest, NextResponse } from "next/server";
interface Props {
  params: { id: number };
}
export const GET = async (req: NextRequest, { params }: Props) => {
  try {
    const userId = req.headers.get("X-User-Id") as string;
    await initializeDatabase();
    const blogData = await getBlogService(params.id, +userId);
    console.log(blogData.get());
    return NextResponse.json(blogData.get());
  } catch (error) {
    return errorHandler(error, req);
  }
};

export const DELETE = async (req: NextRequest, { params }: Props) => {
  try {
    const userId = req.headers.get("X-User-Id") as string;
    console.log(userId);
    await initializeDatabase();
    await deleteBlogService(params.id, +userId);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return errorHandler(error, req);
  }
};

export const PUT = async (req: NextRequest, { params }: Props) => {
  try {
    const body = (await req.json()) as updateBlogParams;
    const userId = req.headers.get("X-User-Id") as string;
    await initializeDatabase();
    const updatedBlog = await updateBlogService(+params.id, +userId, body);
    return NextResponse.json(updatedBlog);
  } catch (error) {
    return errorHandler(error, req);
  }
};
