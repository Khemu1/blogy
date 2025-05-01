import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/config/dbInit";
import {
  deleteCommentService,
  updateCommentService,
} from "@/services/commentServices";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { sanitizeRequestBody } from "@/app/utils";
import { doesUserExist } from "@/services/authServices";
import { rateLimit } from "@/app/utils/redis";
import { CustomError } from "@/middlewares/error/CustomError";

interface Props {
  params: { id: number };
}
export const DELETE = async (req: NextRequest, { params }: Props) => {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const userId = Number(req.headers.get("X-User-Id"));
    await doesUserExist(userId);
    await initializeDatabase();
    await deleteCommentService(+params.id, +userId);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return errorHandler(error, req);
  }
};

export const PATCH = async (req: NextRequest, { params }: Props) => {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const userId = Number(req.headers.get("X-User-Id"));
    await doesUserExist(userId);
    const sentizedData = (await sanitizeRequestBody(req)) as {
      content: string;
      blogId: number;
    };
    await initializeDatabase();
    await updateCommentService(+params.id, +userId, sentizedData.content);
    console.log(
      "comment updated and returning data back ",
      sentizedData.content
    );
    return NextResponse.json(sentizedData.content);
  } catch (error) {
    return errorHandler(error, req);
  }
};
