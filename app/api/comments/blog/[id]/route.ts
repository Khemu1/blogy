import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/config/dbInit";
import {
  deleteCommentService,
  getBlogCommentsService,
  updateCommentService,
} from "@/services/commentServices";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { rateLimit } from "@/app/utils/redis";
import { CustomError } from "@/middlewares/error/CustomError";

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
    const userId = Number(req.headers.get("X-User-Id"));
    console.log(userId);
    await initializeDatabase();
    const comments = await getBlogCommentsService(+params.id);
    return NextResponse.json({ comments });
  } catch (error) {
    return errorHandler(error, req);
  }
};
