import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { doesUserExist } from "@/services/authServices";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("X-User-Id");
    if (!userId) {
      return NextResponse.json({ status: 400, message: "Invalid user ID" });
    }
    const user = await doesUserExist(+userId);
    if (!user) {
      return NextResponse.json({ status: 401, message: "Invalid user" });
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return errorHandler(error, req);
  }
};
