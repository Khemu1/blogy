import { CustomError } from "@/middlewares/error/CustomError";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { deleteUnComplementedUpload } from "@/services/uploadServices";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }

    await deleteUnComplementedUpload();
    return new Response("Uncomplemented uploads deleted successfully", {
      status: 200,
    });
  } catch (error) {
    return errorHandler(error, req);
  }
};
function rateLimit(
  arg0: string,
  arg1: number,
  arg2: number
): { success: any } | PromiseLike<{ success: any }> {
  throw new Error("Function not implemented.");
}
