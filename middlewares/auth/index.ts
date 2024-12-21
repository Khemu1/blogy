import { cookies, headers } from "next/headers";
import {
  generateAccessToken,
  verifyToken,
  accessCookieOptions,
} from "@/services/auth";
import { NextRequest, NextResponse } from "next/server";
import { CustomError } from "../error/CustomError";
import { errorHandler } from "../error/ErrorHandler";

export async function validateUser(req: NextRequest) {
  console.log("user middleware up");

  try {
    const cookieStore = cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      throw new CustomError("No tokens provided", 401, "Please log in.", true);
    }

    if (accessToken) {
      const accessTokenData = await verifyToken(accessToken, true);

      if (!accessTokenData) {
        throw new CustomError(
          "Invalid access token",
          401,
          "Access token is invalid or expired.",
          true
        );
      }

      const response = NextResponse.next();
      response.headers.set("X-User-Id", accessTokenData.id as string);
      response.cookies.set("X-User-Id", accessTokenData.id as string);

      return response;
    }

    if (!accessToken && refreshToken) {
      const refreshTokenData = await verifyToken(refreshToken, false);

      if (!refreshTokenData) {
        throw new CustomError(
          "Invalid refresh token",
          401,
          "Refresh token is invalid or expired.",
          true
        );
      }

      const newAccessToken = await generateAccessToken({
        id: refreshTokenData.id,
      });

      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken, accessCookieOptions);
      response.cookies.set("X-User-Id", refreshTokenData.id as string);

      response.headers.set("X-User-Id", refreshTokenData.id as string);
      return response;
    }

    throw new CustomError(
      "User validation failed",
      500,
      "Unknown error occurred.",
      true
    );
  } catch (error) {
    console.error("Error with user validation:", error);
    return errorHandler(error, req);
  }
}
