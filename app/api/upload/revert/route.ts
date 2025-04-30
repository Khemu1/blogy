import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { deleteUpload } from "@/services/uploadServices";
import { NextRequest, NextResponse } from "next/server";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";
import { doesUserExist } from "@/services/authServices";

export const deleteTempFile = (uploadId: string) => {
  const filePath = join(process.cwd(), "temp", `${uploadId}.ext`);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
    console.log(`File ${uploadId} deleted successfully from temp storage.`);
  } else {
    console.warn(`File ${uploadId} not found in temp storage.`);
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("X-User-Id") as string;
    await doesUserExist(+userId);
    const id = await req.text();
    deleteTempFile(id);

    await deleteUpload(id, +userId);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return errorHandler(error, req);
  }
};
