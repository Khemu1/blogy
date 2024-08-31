import { NextResponse, type NextRequest } from "next/server";
import { registerMiddleware, loginMiddleware } from "./middlewares/users/index";
import { addCommentMiddleware } from "./middlewares/comments/middleware";
import { addBlogMiddleware } from "./middlewares/blogs";
import { validateUser } from "./middlewares/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let finalRes = NextResponse.next();
  // Handle login
  if (pathname.startsWith("/api/users/login")) {
    const response = await loginMiddleware(req);
    if (!response.ok) return response;
  }

  // Handle comment validation (currently commented out, but ensure you handle responses similarly)
  // if (pathname.startsWith("/api/comment")) {
  //   const userValidationResponse = await validateUser(req);
  //   if (!userValidationResponse.ok) return userValidationResponse;

  //   const response = await addCommentMiddleware(req);
  //   if (!response.ok) return response;
  // }

  // Handle blog validation

  if (/^\/api\/blogs\/\d+$/.test(pathname)) {
  } else if (pathname === "/api/blogs") {
    const userValidationResponse = await validateUser(req);
    if (!userValidationResponse.ok) return userValidationResponse; // Return the modified response if it fails

    const blogValidationResponse = await addBlogMiddleware(req);
    if (!blogValidationResponse.ok) return blogValidationResponse; // Return the modified response if it fails

    finalRes = userValidationResponse;
  }

  // Proceed if all validations are successful with the modified response
  return finalRes;
}

export const config = {
  matcher: [
    "/api/users/register",
    "/api/users/login",
    "/api/blogs",
    "/api/comment",
  ],
};
