import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { mkdirSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const path = "/temp";
    const userId = req.headers.get("X-User-Id") as string;
    const uniqueId = crypto.randomUUID();
    mkdirSync(path, { recursive: true });
    return new Response(uniqueId, {
      headers: {
        "Content-Type": "plain/text",
      },
    });
  } catch (error) {
    return errorHandler(error, req);
  }
};
