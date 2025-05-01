import { rateLimit } from "@/app/utils/redis";
import { initializeDatabase } from "@/config/dbInit";
import { CustomError } from "@/middlewares/error/CustomError";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { doesUserExist } from "@/services/authServices";
import { getBlogForEditService } from "@/services/blogServices";
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
    const userId = Number(req.headers.get("X-User-Id") as string);
    await initializeDatabase();
    await doesUserExist(userId);
    const blogId = params.id;
    const blog = await getBlogForEditService(blogId, userId);
    return NextResponse.json(blog);
  } catch (error) {
    return errorHandler(error, req);
  }
};
