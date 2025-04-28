import { cookies } from "next/headers";
import { generateAccessToken, verifyToken } from "@/services/auth";
import { NextRequest, NextResponse } from "next/server";
import { CustomError } from "@/middlewares/error/CustomError";
import { errorHandler } from "@/middlewares/error/ErrorHandler";

export async function validateUser(req: NextRequest) {
  console.log("user middleware up");

  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (accessToken) {
      const accessTokenData = await verifyToken(accessToken, true);

      if (!accessTokenData) {
        // Invalid access token, redirect to /login
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const response = NextResponse.next();
      response.headers.set("X-User-Id", accessTokenData.id as string);
      response.cookies.set("X-User-Id", accessTokenData.id as string);

      return response;
    }

    if (!accessToken && refreshToken) {
      const refreshTokenData = await verifyToken(refreshToken, false);

      if (!refreshTokenData) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const newAccessToken = await generateAccessToken({
        id: refreshTokenData.id,
      });

      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken, { path: "/" });
      response.cookies.set("X-User-Id", refreshTokenData.id as string);
      response.headers.set("X-User-Id", refreshTokenData.id as string);

      return response;
    }

    return NextResponse.redirect(new URL("/login", req.url));
  } catch (error) {
    console.error("Error with user validation:", error);
    return errorHandler(error, req);
  }
}
