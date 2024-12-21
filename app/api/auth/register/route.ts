import { RegisterFormProps, UserProps } from "@/types";
import { initializeDatabase } from "@/config/dbInit";
import { NextRequest, NextResponse } from "next/server";
import {
  createTokens,
  accessCookieOptions,
  refreshCookieOptions,
} from "@/services/auth";
import { registerUserService } from "@/services/authServices";
import { errorHandler } from "@/middlewares/error/ErrorHandler";

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as RegisterFormProps;

    await initializeDatabase();
    const user = await registerUserService(data);
    const { accessToken, refreshToken } = await createTokens(user.id);
    const response = NextResponse.json(
      { message: "User created successfully", username: user.username },
      { status: 201 }
    );
    response.cookies.set("accessToken", accessToken, accessCookieOptions);
    response.cookies.set("refreshToken", refreshToken, refreshCookieOptions);
    return response;
  } catch (error) {
    return errorHandler(error, req);
  }
}
