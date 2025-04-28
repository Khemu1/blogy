import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/config/dbInit";
import {
  deleteCommentService,
  getBlogCommentsService,
  updateCommentService,
} from "@/services/commentServices";
import { errorHandler } from "@/middlewares/error/ErrorHandler";

interface Props {
  params: { id: number };
}
export const GET = async (req: NextRequest, { params }: Props) => {
  try {
    const userId = Number(req.headers.get("X-User-Id"));
    console.log(userId);
    await initializeDatabase();
    const comments = await getBlogCommentsService(+params.id);
    return NextResponse.json({ comments });
  } catch (error) {
    return errorHandler(error, req);
  }
};
