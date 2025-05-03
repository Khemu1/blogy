import { EditBlogProps } from "@/app/types";
import { sanitizeRequestBody } from "@/app/utils";
import { rateLimit } from "@/app/utils/redis";
import { initializeDatabase } from "@/config/dbInit";
import { CustomError } from "@/middlewares/error/CustomError";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { doesUserExist } from "@/services/authServices";
import {
  deleteBlogService,
  getBlogService,
  updateBlogService,
} from "@/services/blogServices";
import { NextRequest, NextResponse } from "next/server";
interface Props {
  params: { id: number };
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const userId = req.headers.get("X-User-Id") as string;
    await initializeDatabase();
    const blogData = await getBlogService(params.id, +userId);
    return NextResponse.json(blogData.get());
  } catch (error) {
    return errorHandler(error, req);
  }
};

export const DELETE = async (req: NextRequest, { params }: Props) => {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const userId = req.headers.get("X-User-Id") as string;
    await doesUserExist(+userId);
    await initializeDatabase();
    await deleteBlogService(params.id, +userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return errorHandler(error, req);
  }
};

export const PUT = async (req: NextRequest, { params }: Props) => {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    await initializeDatabase();
    const userId = req.headers.get("X-User-Id") as string;
    await doesUserExist(+userId);
    const sentizedData = (await sanitizeRequestBody(req)) as EditBlogProps;
    await updateBlogService(+params.id, +userId, sentizedData);
    return NextResponse.json(sentizedData);
  } catch (error) {
    return errorHandler(error, req);
  }
};
