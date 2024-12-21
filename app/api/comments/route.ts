import { initializeDatabase } from "@/config/dbInit";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { addCommentService } from "@/services/commentServices";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data: { content: string; blogId: number } = await req.json();
    const userId = Number(req.headers.get("X-User-Id"));
    await initializeDatabase();
    await addCommentService(data, +userId);
    return Response.json(
      { message: "Comment created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error, req);
  }
}
