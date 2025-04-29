import { NextResponse, type NextRequest } from "next/server";
import {
  registerMiddleware,
  loginMiddleware,
} from "./middlewares/users/middleware";
import { addCommentMiddleware } from "./middlewares/comments/middleware";
import { addBlogMiddleware } from "./middlewares/blogs/middleware";
import { validateUser } from "./middlewares/auth";
import { sendUserIdIfExists } from "./middlewares/auth/userId";
import { errorHandler } from "./middlewares/error/ErrorHandler"; // Import your error handler

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Route-specific handling
    if (pathname.startsWith("/api/auth/login")) {
      return await loginMiddleware(req);
    }
    if (pathname.startsWith("/api/auth/register")) {
      return await registerMiddleware(req);
    }

    if (pathname.startsWith("/api/comments")) {
      // Check if it's a GET request for comments
      if (req.method === "GET" && /^\/api\/comments\/\d+$/.test(pathname)) {
        return await sendUserIdIfExists(req);
      }

      // Validate user for other comment-related actions
      const userValidationResponse = await validateUser(req);
      if (!userValidationResponse.ok) return userValidationResponse;

      // Pass request to comment middleware
      if (req.method === "POST") {
        return await addCommentMiddleware(req, userValidationResponse);
      }
      return userValidationResponse;
    }

    if (pathname.startsWith("/api/blogs")) {
      // Handle GET request for a specific blog
      if (req.method === "GET" && /^\/api\/blogs\/\d+$/.test(pathname)) {
        return await sendUserIdIfExists(req);
      }
      const userValidationResponse = await validateUser(req);
      if (!userValidationResponse.ok) return userValidationResponse;
      if (req.method === "POST") {
        return await addBlogMiddleware(req, userValidationResponse);
      }
      return userValidationResponse;
    }

    if (pathname === "/api/users/myInfo") {
      console.log("yesssss my info");
      return await validateUser(req);
    }
    if (pathname.startsWith("/api/upload")) {
      // Handle upload process
      const userValidationResponse = await validateUser(req);
      if (!userValidationResponse.ok) return userValidationResponse;
      return userValidationResponse;
    }

    return NextResponse.next();
  } catch (error) {
    console.log("error from root middleware", error);
    return errorHandler(error, req);
  }
}

export const config = {
  matcher: [
    "/api/auth",
    "/api/blogs/:path*",
    "/api/comments/:path*",
    "/api/users/myInfo",
    "/api/upload/process",
  ],
};
