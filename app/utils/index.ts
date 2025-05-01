import DOMPurify from "dompurify";
import { NextRequest } from "next/server";
import { CustomError } from "@/middlewares/error/CustomError";
export async function sanitizeRequestBody(req: NextRequest) {
  const data = await req.json();

  if (!data) {
    throw new CustomError("Content is required", 400, "Content is required");
  }

  const sanitizedContent: Record<string, any> = {};

  // run JSDOM only on the server-side
  if (typeof window === "undefined") {
    const { JSDOM } = await import("jsdom");
    const window = new JSDOM("").window;
    const purify = DOMPurify(window);

    for (const key in data) {
      if (data[key] && typeof data[key] === "string") {
        sanitizedContent[key] = purify.sanitize(data[key]);
      } else {
        sanitizedContent[key] = data[key];
      }
    }
  } else {
    // If it's client-side, directly sanitize using DOMPurify
    for (const key in data) {
      if (data[key] && typeof data[key] === "string") {
        sanitizedContent[key] = DOMPurify.sanitize(data[key]);
      } else {
        sanitizedContent[key] = data[key];
      }
    }
  }

  return sanitizedContent;
}

export const storeUserData = (data: { id: number; name: string }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify(data));
  }
};

