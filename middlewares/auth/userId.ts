import { verifyToken } from "@/services/auth";
import { NextRequest, NextResponse } from "next/server";

export async function sendUserIdIfExists(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      console.log("[sendUserIdIfExists] No tokens found");
      return NextResponse.next();
    }

    let tokenData = null;

    if (accessToken) {
      try {
        tokenData = await verifyToken(accessToken, true);
      } catch {
        console.log("[sendUserIdIfExists] Access token invalid or expired");
      }
    }

    if (!tokenData && refreshToken) {
      try {
        tokenData = await verifyToken(refreshToken, false);
      } catch {
        console.log("[sendUserIdIfExists] Refresh token invalid or expired");
      }
    }

    const response = NextResponse.next();

    if (tokenData?.id) {
      response.headers.set("X-User-Id", String(tokenData.id));
    }

    return response;
  } catch (error) {
    throw error;
  }
}
