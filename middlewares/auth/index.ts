import { cookies } from "next/headers";
import { generateAccessToken, verifyToken } from "@/services/auth";
import { NextRequest, NextResponse } from "next/server";
import { CustomError } from "@/middlewares/error/CustomError";
export async function validateUser(req: NextRequest) {
  console.log("user middleware up");

  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!accessToken && !refreshToken) {
      throw new CustomError("Invalid token", 401, "Invalid token", true);
    }

    if (accessToken) {
      const accessTokenData = await verifyToken(accessToken, true);

      const response = NextResponse.next();
      response.headers.set("X-User-Id", accessTokenData.id as string);
      response.cookies.set("X-User-Id", accessTokenData.id as string);
      console.log("user is authenticated");

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
      console.log("user is authenticated");
      return response;
    }

    throw new CustomError("Invalid token", 401, "Invalid token", true);
  } catch (error) {
    console.error("Error with user validation:", error);
    throw error;
  }
}
