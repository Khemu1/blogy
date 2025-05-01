import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { deleteUnComplementedUpload } from "@/services/uploadServices";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await deleteUnComplementedUpload();
    return new Response("Uncomplemented uploads deleted successfully", {
      status: 200,
    });
  } catch (error) {
    return errorHandler(error, req);
  }
};
