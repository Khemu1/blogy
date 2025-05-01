import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { doesUserExist } from "@/services/authServices";
import { getUserCommentsService } from "@/services/commentServices";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const userId = Number(req.headers.get("X-User-Id"));
    await doesUserExist(userId);
    const comments = await getUserCommentsService(userId);
    return NextResponse.json(comments);
  } catch (error) {
    return errorHandler(error, req);
  }
};
