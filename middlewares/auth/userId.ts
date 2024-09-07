import { verifyToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function getBlogComments(req: NextRequest) {
  console.log(" Id cheker middleware up");
  try {
    // Retrieve tokens from cookies
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      // No tokens provided, return response immediately
      return new NextResponse();
    }

    if (accessToken) {
      const accessTokenData = await verifyToken(accessToken, true);

      if (!accessTokenData) {
        return new NextResponse();
      }

      const response = NextResponse.next();
      response.headers.set("X-User-Id", accessTokenData.id as string);
      return response;
    }

    if (!accessToken && refreshToken) {
      // Validate the refresh token
      const refreshTokenData = await verifyToken(refreshToken, false);

      if (!refreshTokenData) {
        return new NextResponse();
      }

      const response = NextResponse.next();
      response.headers.set("X-User-Id", refreshTokenData.id as string);
      return response;
    }

    return new NextResponse();
  } catch (error) {
    console.error("Error checking User Id:", error);
    return NextResponse.json(
      { message: "User Id check failed" },
      { status: 500 }
    );
  }
}
