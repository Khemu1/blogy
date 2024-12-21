import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/config/dbInit";
import {
  deleteCommentService,
  updateCommentService,
} from "@/services/commentServices";
import { errorHandler } from "@/middlewares/error/ErrorHandler";

interface Props {
  params: { id: number };
}
export const DELETE = async (req: NextRequest, { params }: Props) => {
  try {
    const userId = Number(req.headers.get("X-User-Id"));
    console.log(userId);
    await initializeDatabase();
    await deleteCommentService(+params.id, +userId);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return errorHandler(error, req);
  }
};

export const PUT = async (req: NextRequest, { params }: Props) => {
  try {
    const data: { content: string } = await req.json();
    const userId = Number(req.headers.get("X-User-Id"));
    await initializeDatabase();
    const updatedComment = await updateCommentService(
      +params.id,
      +userId,
      data.content
    );
    return NextResponse.json(updatedComment);
  } catch (error) {
    return errorHandler(error, req);
  }
};
