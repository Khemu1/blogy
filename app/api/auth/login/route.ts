import { initializeDatabase } from "@/config/dbInit";
import { NextResponse, NextRequest } from "next/server";
import {
  accessCookieOptions,
  refreshCookieOptions,
  createTokens,
} from "@/services/auth";
import { loginUserService } from "@/services/authServices";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { LoginFormProps } from "@/app/types";
import { rateLimit } from "@/app/utils/redis";
import { CustomError } from "@/middlewares/error/CustomError";
import { sanitizeRequestBody } from "@/app/utils";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const data = (await sanitizeRequestBody(req)) as LoginFormProps;
    await initializeDatabase();
    console.log("inside login route");
    const user = await loginUserService(data);
    const { accessToken, refreshToken } = await createTokens(user.id);

    const response = NextResponse.json(
      {
        message: "Logged in successfully",
        user: { username: user.username, id: user.id },
      },
      { status: 200 }
    );
    response.cookies.set("accessToken", accessToken, accessCookieOptions);
    response.cookies.set("refreshToken", refreshToken, refreshCookieOptions);
    return response;
  } catch (error) {
    return errorHandler(error, req);
  }
}
