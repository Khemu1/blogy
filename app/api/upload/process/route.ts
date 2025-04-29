import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { createUpload } from "@/services/uploadServices";
import { mkdirSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export const POST = async (req: NextRequest) => {
  try {
    const path = "temp";
    const userId = req.headers.get("X-User-Id") as string;
    const form = await req.formData();

    const fileSize = req.headers.get("Content-Length") as string;
    const metaDtat = form.get("metadata") as string;
    const metadata: Record<string, string> = JSON.parse(metaDtat);
    console.log("metadata", metadata);
    mkdirSync(join(process.cwd(), path), { recursive: true });
    const uniqueId = await createUpload({
      userId: Number(userId),
      fileName: metadata.name,
      mimeType: metadata.type,
      fileSize: +fileSize,
    });
    return new Response(uniqueId, {
      headers: {
        "Content-Type": "plain/text",
      },
    });
  } catch (error) {
    return errorHandler(error, req);
  }
};
