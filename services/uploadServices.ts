import Upload from "@/db/models/Upload";
import UploadChunk from "@/db/models/UploadChunk";
import { CustomError } from "@/middlewares/error/CustomError";
import { Op } from "sequelize";

export const createUpload = async (data: {
  userId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
}) => {
  try {
    console.log("trying to create an upload ", data);
    const uniqueId = crypto.randomUUID();
    await Upload.create({
      id: uniqueId,
      userId: data.userId,
      fileName: data.fileName,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
    });
    console.log("Upload created successfully");
    console.log("Upload ID:", uniqueId);
    return uniqueId;
  } catch (error) {
    throw error;
  }
};

export const createUploadChunk = async (data: {
  uploadId: string;
  chunkLength: number;
  offset: number;
}) => {
  try {
    await UploadChunk.create({
      chunk_length: data.chunkLength,
      offset: data.offset,
      upload_id: data.uploadId,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteUpload = async (id: string, userId: number) => {
  try {
    console.log("Deleting upload with ID:", id, "and user ID:", userId);
    const upload = await Upload.destroy({
      where: { id: id, userId: userId },
    });
    if (upload === 0) {
      throw new CustomError("Upload not found", 404);
    }
    return upload;
  } catch (error) {
    throw error;
  }
};

export const deleteUnComplementedUpload = async () => {
  try {
    const upload = await Upload.destroy({
      where: {
        isCompleted: false,
        createdAt: { [Op.lt]: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
      },
    });
    console.log("Deleted", upload, "uncomplemented uploads");
  } catch (error) {
    throw error;
  }
};
