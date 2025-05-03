import { NextResponse, NextRequest } from "next/server";
import { getEditBlogSchema, getNewBlogSchema } from "@/app/utils/blog";
import { ZodError } from "zod";
import { CustomError } from "../error/CustomError";
import { validateWithSchema } from "@/app/utils/comment";

export async function addBlogMiddleware(req: NextRequest, res: NextResponse) {
  try {
    const data: { title: string; content: string } = await req.json();
    if (!data) {
      throw new CustomError("Invalid Blog Data", 400, "", true);
    }
    const schema = getNewBlogSchema();
    await schema.parseAsync(data);
    const response = NextResponse.next();
    response.headers.set(
      "X-User-Id",
      res.cookies.get("X-User-Id")?.value as string
    );
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = validateWithSchema(error);
      throw new CustomError("Invalid Blog Data", 400, "", true, "", errors);
    }
    throw error;
  }
}

export async function editBlogMiddleware(req: NextRequest, res: NextResponse) {
  try {
    const data: { title: string; content: string; blogId: number } =
      await req.json();
    if (!data) {
      throw new CustomError("Invalid Blog Data", 400, "", true);
    }

    const schema = getEditBlogSchema();
    await schema.parseAsync(data);
    const response = NextResponse.next();
    response.headers.set(
      "X-User-Id",
      res.cookies.get("X-User-Id")?.value as string
    );
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = validateWithSchema(error);
      throw new CustomError("Invalid Blog Data", 400, "", true, "", errors);
    }
    throw error;
  }
}
