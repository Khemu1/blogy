import { CustomError } from "@/middlewares/error/CustomError";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  rename,
  unlinkSync,
} from "fs";
import { join } from "path";

const tempPath = join(process.cwd(), "temp");

export const moveFileFromTempToUploads = async (
  id: string,
  mimeType: string
): Promise<string> => {
  const tempFilePath = join(tempPath, id);
  const extension = mimeType.split("/").pop();
  const uploadDir = join(process.cwd(), "public", "assets", "blogs");

  if (!existsSync(tempFilePath)) {
    throw new Error(`Temp file does not exist: ${tempFilePath}`);
  }

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const destinationPath = join(uploadDir, `${id}.${extension}`);

  try {
    rename(tempFilePath, destinationPath, (error) => {
      if (error) {
        throw new Error("Could not move file to upload directory");
      }
    });
    console.log("File moved to uploads:", destinationPath);
    return `/assets/blogs/${id}.${extension}`;
  } catch (error) {
    console.error("Failed to move file:", error);
    throw new Error("Could not move file to upload directory");
  }
};
export const appendChunkToUpload = async (
  id: string,
  chunk: ArrayBuffer | SharedArrayBuffer
) => {
  try {
    if (chunk instanceof ArrayBuffer) {
      const uint8Array = new Uint8Array(chunk);
      const filePath = join(tempPath, `${id}`);
      await new Promise<void>((resolve, reject) => {
        const stream = createWriteStream(filePath, { flags: "a" });
        stream.write(uint8Array);
        stream.end();
        stream.on("finish", resolve);
        stream.on("error", reject);
      });
    } else {
      throw new CustomError("Invalid chunk type", 400);
    }
  } catch (error) {
    throw error;
  }
};

export const deleteTempFile = (uploadId: string) => {
  const filePath = join(process.cwd(), "temp", `${uploadId}`);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
    console.log(`File ${uploadId} deleted successfully from temp storage.`);
  } else {
    console.warn(`File ${uploadId} not found in temp storage.`);
  }
};

export const deleteUpload = async (uploadId: string) => {
  const filePath = join(
    process.cwd(),
    "public",
    "assets",
    "blogs",
    `${uploadId}`
  );
  if (existsSync(filePath)) {
    unlinkSync(filePath);
    console.log(`File ${uploadId} deleted successfully from uploads.`);
  } else {
    console.warn(`File ${uploadId} not found in uploads.`);
  }
};
