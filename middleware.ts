import { NextResponse, type NextRequest } from "next/server";
import {
  registerMiddleware,
  loginMiddleware,
} from "./middlewares/users/middleware";
import { addCommentMiddleware } from "./middlewares/comments/middleware";
import { addBlogMiddleware } from "./middlewares/blogs/middleware";
import { validateUser } from "./middlewares/auth";
import { getBlogComments } from "./middlewares/auth/userId";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/users/login")) {
    const response = await loginMiddleware(req);
    if (!response.ok) return response;

    return response;
  }

  if (/^\/api\/comments\/\d+$/.test(pathname)) {
    console.log("comment");

    if (req.method === "GET") {
      const checkId = await getBlogComments(req);
      return checkId; // Return directly the response from `getBlogComments`
    }

    // Validate the user
    const userValidationResponse = await validateUser(req);
    if (!userValidationResponse.ok) return userValidationResponse;

    // Make sure the new response contains all cookies and headers

    const commentValidation = await addCommentMiddleware(req);
    if (!commentValidation.ok) return commentValidation;
    return userValidationResponse;
  }

  if (/^\/api\/blogs\/\d+$/.test(pathname)) {
    console.log("i did check id");
    if (req.method === "GET") {
      const checkId = await getBlogComments(req);
      return checkId;
    }
  } else if (pathname === "/api/blogs") {
    const userValidationResponse = await validateUser(req);

    if (!userValidationResponse.ok) return userValidationResponse;
    return userValidationResponse;
  }

  // Ensure that cookies set in any of the middleware are included in the final response
}

export const config = {
  matcher: [
    "/api/users/register",
    "/api/users/login",
    "/api/blogs",
    "/api/comments/:path*",
  ],
};
