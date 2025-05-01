import { initializeDatabase } from "@/config/dbInit";
import { NextRequest, NextResponse } from "next/server";
import {
  createTokens,
  accessCookieOptions,
  refreshCookieOptions,
} from "@/services/auth";
import { registerUserService } from "@/services/authServices";
import { errorHandler } from "@/middlewares/error/ErrorHandler";
import { RegisterFormProps } from "@/app/types";
import { rateLimit } from "@/app/utils/redis";
import { CustomError } from "@/middlewares/error/CustomError";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "localhost";
  try {
    const { success } = await rateLimit(`rate_limit:${ip}`, 60, 60);
    if (!success) {
      throw new CustomError("Too many requests", 429);
    }
    const data = (await req.json()) as RegisterFormProps;

    await initializeDatabase();
    const user = await registerUserService(data);
    const { accessToken, refreshToken } = await createTokens(user.id);
    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: { username: user.username, id: user.id },
      },
      { status: 201 }
    );
    response.cookies.set("accessToken", accessToken, accessCookieOptions);
    response.cookies.set("refreshToken", refreshToken, refreshCookieOptions);
    return response;
  } catch (error) {
    return errorHandler(error, req);
  }
}
