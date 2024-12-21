import { initializeDatabase } from "@/config/dbInit";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { getMyData } from "@/services/userServices";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("X-User-Id") as string;
    await initializeDatabase();
    const userData = await getMyData(+userId);
    return NextResponse.json(userData);
  } catch (error) {
    return errorHandler(error, req);
  }
}
