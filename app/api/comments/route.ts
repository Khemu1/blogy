import { sanitizeRequestBody } from "@/app/utils";
import { rateLimit } from "@/app/utils/redis";
import { initializeDatabase } from "@/config/dbInit";
import { CustomError } from "@/middlewares/error/CustomError";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { addCommentService } from "@/services/commentServices";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
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
