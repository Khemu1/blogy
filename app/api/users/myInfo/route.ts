import { initializeDatabase } from "@/config/dbInit";
import { CustomError } from "@/middlewares/error/CustomError";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { getMyData } from "@/services/userServices";
import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
import { rateLimit } from "@/app/utils/redis";
type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const userId = req.headers.get("X-User-Id") as string;
    await initializeDatabase();
    const userData = await getMyData(+userId);
    return NextResponse.json(userData);
  } catch (error) {
    return errorHandler(error, req);
  }
}
