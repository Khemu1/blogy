import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { doesUserExist } from "@/services/authServices";
import { getUserBlogsService } from "@/services/blogServices";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const userId = Number(req.headers.get("X-User-Id"));
    await doesUserExist(userId);
    const blogs = await getUserBlogsService(userId);
    return NextResponse.json(blogs);
  } catch (error) {
    return errorHandler(error, req);
  }
};
