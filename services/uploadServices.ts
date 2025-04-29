import Upload from "@/db/models/Upload";
import UploadChunk from "@/db/models/UploadChunk";
import { CustomError } from "@/middlewares/error/CustomError";

export const createUpload = async (data: {
  userId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
}) => {
  try {
    const uniqueId = crypto.randomUUID();
    console.log("new file to insert ", { ...data, id: uniqueId });
    await Upload.create({
      id: uniqueId,
      userId: data.userId,
      fileName: data.fileName,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
    });
    return uniqueId;
  } catch (error) {
    throw error;
  }
};
