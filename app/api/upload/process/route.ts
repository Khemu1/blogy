import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { doesUserExist } from "@/services/authServices";
import { createUpload, createUploadChunk } from "@/services/uploadServices";
import { mkdirSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { appendChunkToUpload } from "@/services/helpers/upload";
import { CustomError } from "@/middlewares/error/CustomError";
import { rateLimit } from "@/app/utils/redis";

type ParsedFormData = {
  metadata: { name: string; type: string };
  file: File | null;
};
export const POST = async (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const userIdHeader = req.headers.get("X-User-Id");
    if (!userIdHeader) {
      throw new CustomError("Missing user ID header", 400);
    }

    const userId = Number(userIdHeader);
    if (isNaN(userId)) {
      throw new CustomError("Invalid user ID", 400);
    }

    await doesUserExist(userId);

    const tempPath = join(process.cwd(), "temp");
    mkdirSync(tempPath, { recursive: true });

    const form = await req.formData();
    const { metadata, file } = parseFormData(form);

    const fileSize = Number(req.headers.get("Content-Length"));
    if (!fileSize || isNaN(fileSize)) {
      console.log(fileSize);
      console.log("file size is not a number");
      return NextResponse.json({ error: "Invalid file size" }, { status: 400 });
    }

    const uploadId = await createUpload({
      userId,
      fileName: metadata.name,
      mimeType: metadata.type,
      fileSize,
    });

    if (fileSize < 500_000 && file) {
      if (!file) {
        throw new CustomError("File is required when size is small", 400);
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const chunk = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );

      await appendChunkToUpload(uploadId, chunk);
      await createUploadChunk({
        uploadId,
        chunkLength: fileSize,
        offset: 1,
      });
    }

    return new Response(uploadId, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    return errorHandler(error, req);
  }
};

// for some reason when trying to extract the file from the form data, it's not working
// had to create this method in order to make it work some how
const parseFormData = (formData: FormData): ParsedFormData => {
  let metadata: ParsedFormData["metadata"] | null = null;
  let file: File | null = null;

  for (const [key, value] of Array.from(formData.entries())) {
    if (key === "metadata" && typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (
          typeof parsed.name !== "string" ||
          typeof parsed.type !== "string"
        ) {
          throw new Error("Missing required metadata fields");
        }
        metadata = parsed;
      } catch (err) {
        throw new CustomError("Invalid metadata format", 400);
      }
    } else if (key === "file" && value instanceof File) {
      file = value;
    }
  }

  if (!metadata) {
    throw new CustomError("Metadata is required", 400);
  }

  return { metadata, file };
};

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const preferredRegion = "auto";
