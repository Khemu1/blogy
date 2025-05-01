import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { deleteUpload } from "@/services/uploadServices";
import { NextRequest, NextResponse } from "next/server";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";
import { doesUserExist } from "@/services/authServices";
import { rateLimit } from "@/app/utils/redis";
import { deleteTempFile } from "@/services/helpers/upload";
import { CustomError } from "@/middlewares/error/CustomError";

export const DELETE = async (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const userId = req.headers.get("X-User-Id") as string;
    await doesUserExist(+userId);
    const id = await req.text();

    await deleteUpload(id, +userId);
    deleteTempFile(id);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return errorHandler(error, req);
  }
};
