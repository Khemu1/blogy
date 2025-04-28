import { sanitizeRequestBody } from "@/app/utils";
import { initializeDatabase } from "@/config/dbInit";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { addCommentService } from "@/services/commentServices";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const sanitizedData = (await sanitizeRequestBody(req)) as {
      content: string;
      blogId: number;
    };
    const userId = Number(req.headers.get("X-User-Id"));
    await initializeDatabase();
    const comment = await addCommentService(sanitizedData, +userId);
    return Response.json(
      { message: "Comment created successfully", comment: sanitizedData },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error, req);
  }
}
