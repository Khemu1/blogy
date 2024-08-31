import {
  generateAccessToken,
  verifyToken,
  accessCookieOptions,
} from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function validateUser(req: NextRequest) {
  console.log("validateUser middleware");
  try {
    // Retrieve tokens from cookies
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      // No tokens provided, return response immediately
      return NextResponse.json(
        { message: "No tokens provided" },
        { status: 401 }
      );
    }

    if (accessToken) {
      const accessTokenData = await verifyToken(accessToken, true);

      if (!accessTokenData) {
        return NextResponse.json(
          { message: "Invalid access token" },
          { status: 401 }
        );
      }

      const response = NextResponse.next();
      response.headers.set("X-User-Id", accessTokenData.id as string); // Add user ID to header
      return response;
    }

    if (!accessToken && refreshToken) {
      // Validate the refresh token
      const refreshTokenData = await verifyToken(refreshToken, false);

      if (!refreshTokenData) {
        return NextResponse.redirect("/login", { status: 401 });
      }

      // Generate a new access token
      const newAccessToken = await generateAccessToken({
        id: refreshTokenData.id,
      });

      // Create the response with the new access token

      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken, accessCookieOptions);
      response.headers.set("x-User-Id", refreshTokenData.id as string);
      return response;
    }

    return NextResponse.json(
      { message: "User validation failed" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error with user validation:", error);
    return NextResponse.json(
      { message: "User validation failed" },
      { status: 500 }
    );
  }
}
