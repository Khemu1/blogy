import { rateLimit } from "@/app/utils/redis";
import { CustomError } from "@/middlewares/error/CustomError";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { doesUserExist } from "@/services/authServices";
import { getUserBlogsService } from "@/services/blogServices";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const userId = Number(req.headers.get("X-User-Id"));
    await doesUserExist(userId);
    const blogs = await getUserBlogsService(userId);
    return NextResponse.json(blogs);
  } catch (error) {
    return errorHandler(error, req);
  }
};
