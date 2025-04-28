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

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as LoginFormProps;
    await initializeDatabase();
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
