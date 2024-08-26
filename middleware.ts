import { NextResponse, type NextRequest } from "next/server";
import { registerMiddleware, loginMiddleware } from "./middlewares/users/index";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/users/register")) {
    const response1 = await registerMiddleware(req);
    if (!response1.ok) return registerMiddleware;
  }

  if (pathname.startsWith("/api/users/login")) {
    return loginMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/users/register", "/api/users/login"], // don't forget to add the paths
};
