import { NextResponse, type NextRequest } from "next/server";
import {
  registerMiddleware,
  loginMiddleware,
} from "./middlewares/users/middleware";
import {
  addCommentMiddleware,
  editCommentMiddleware,
} from "./middlewares/comments/middleware";
import {
  addBlogMiddleware,
  editBlogMiddleware,
} from "./middlewares/blogs/middleware";
import { validateUser } from "./middlewares/auth";
import { sendUserIdIfExists } from "./middlewares/auth/userId";
import { errorHandler } from "./middlewares/error/ErrorHandler";

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Route-specific handling
    if (pathname.startsWith("/api/auth/login")) {
      console.log("inside login middleware");
      return await loginMiddleware(req);
    }
    if (pathname.startsWith("/api/auth/register")) {
      console.log("inside register middleware");
      return await registerMiddleware(req);
    }

    if (pathname.startsWith("/api/comments")) {
      // Check if it's a GET request for comments
      if (req.method === "GET" && /^\/api\/comments\/\d+$/.test(pathname)) {
        return await sendUserIdIfExists(req);
      }

      // Pass request to comment middleware

      const userValidationResponse = await validateUser(req);
      if (!userValidationResponse.ok) return userValidationResponse;
      if (req.method === "POST") {
        return await addCommentMiddleware(req, userValidationResponse);
      }
      if (req.method === "PATCH") {
        return await editCommentMiddleware(req, userValidationResponse);
      }
      return userValidationResponse;
    }

    if (pathname.startsWith("/api/blogs")) {
      // Handle GET request for a specific blog
      if (req.method === "GET" && /^\/api\/blogs\/\d+$/.test(pathname)) {
        return await sendUserIdIfExists(req);
      }
      if (req.method === "POST") {
        const userValidationResponse = await validateUser(req);
        console.log("inside add blog middleware and passed user validation");
        return await addBlogMiddleware(req, userValidationResponse);
      }
      if (req.method === "PUT") {
        const userValidationResponse = await validateUser(req);
        return await editBlogMiddleware(req, userValidationResponse);
      }
      if (req.method === "DELETE") {
        console.log("inside delete blog middleware");
        const userValidationResponse = await validateUser(req);
        return userValidationResponse;
      }
    }

    if (pathname.includes("/api/blogs/fetch")) {
      const userValidationResponse = await validateUser(req);
      return userValidationResponse;
    }

    if (pathname.includes("/api/users")) {
      return await validateUser(req);
    }
    if (pathname.startsWith("/api/upload")) {
      const userValidationResponse = await validateUser(req);
      if (!userValidationResponse.ok) return userValidationResponse;
      return userValidationResponse;
    }
    if (pathname.startsWith("/api/validate-user")) {
      if (req.method === "GET") {
        const userValidationResponse = await validateUser(req);
        return userValidationResponse;
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.log("error from root middleware", error);
    return errorHandler(error, req);
  }
}

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/api/validate-user",
    "/api/blogs/:path*",
    "/api/comments/:path*",
    "/api/users/:path*",
    "/api/upload/process",
    "/api/upload",
    "/api/upload/revert",
  ],
};
