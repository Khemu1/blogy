import { NewBlogProp } from "@/app/types";
import { sanitizeRequestBody } from "@/app/utils";
import { rateLimit } from "@/app/utils/redis";
import { initializeDatabase } from "@/config/dbInit";
import { CustomError } from "@/middlewares/error/CustomError";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { doesUserExist } from "@/services/authServices";
import {
  addBlogService,
  getAllBlogsService,
  getBlogsParams,
  getPageNumber,
} from "@/services/blogServices";
import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
  try {
    const ip = req.headers.get("x-forwarded-for") || "localhost";
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const userId = req.headers.get("X-User-Id") as string;
    await doesUserExist(+userId);
    const sentizedData = (await sanitizeRequestBody(req)) as NewBlogProp;
    await initializeDatabase();
    const blogId = await addBlogService(sentizedData, +userId);
    return NextResponse.json({ blogId }, { status: 201 });
  } catch (error) {
    return errorHandler(error, req);
  }
};

export const GET = async (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
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
