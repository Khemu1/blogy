import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { createUploadChunk } from "@/services/uploadServices";
import { doesUserExist } from "@/services/authServices";
import { appendChunkToUpload } from "@/services/helpers/upload";

export const PATCH = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("X-User-Id") as string;
    await doesUserExist(+userId);
    const url = req.url;
    const id = url.split("?patch=").pop();
    if (!id) {
      return NextResponse.json({ status: 400, message: "Invalid ID" });
    }

    const offset = req.headers.get("Upload-Offset");
    const size = req.headers.get("Upload-Length");

    if (!offset || !size) {
      return NextResponse.json({
        status: 400,
        message: "Missing Upload-Offset or Upload-Length headers",
      });
    }

    const parsedOffset = parseInt(offset);
    const parsedSize = parseInt(size);

    if (isNaN(parsedOffset) || isNaN(parsedSize)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid Offset or Length values",
      });
    }
    const chunk = await req.arrayBuffer();
    await appendChunkToUpload(id, chunk);
    await createUploadChunk({
      uploadId: id,
      chunkLength: parsedSize,
      offset: parsedOffset,
    });

    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    return errorHandler(error, req);
  }
};
