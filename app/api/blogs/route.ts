import { initializeDatabase } from "@/config/dbInit";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import {
  addBlogService,
  getAllBlogsService,
  getBlogsParams,
  getPageNumber,
} from "@/services/blogServices";
import { NewBlogProp } from "@/types";
import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as NewBlogProp;
    const userId = req.headers.get("X-User-Id") as string;
    await initializeDatabase();
    const blogId = await addBlogService(body, +userId);
    return NextResponse.json({ blogId }, { status: 201 });
  } catch (error) {
    return errorHandler(error, req);
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await initializeDatabase();
    const { searchParams, ordering } = getBlogsParams(req);
    const pageNumber = getPageNumber(req);
    const { blogs, totalPages } = await getAllBlogsService(
      searchParams,
      ordering,
      pageNumber
    );
    return NextResponse.json({ blogs, totalPages }, { status: 200 });
  } catch (error) {
    return errorHandler(error, req);
  }
};
