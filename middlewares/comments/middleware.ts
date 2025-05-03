import { NextResponse, NextRequest } from "next/server";
import { getCommentSchema, validateWithSchema } from "@/app/utils/comment";
import { ZodError } from "zod";
import { CustomError } from "../error/CustomError";

export async function addCommentMiddleware(
  req: NextRequest,
  res: NextResponse
) {
  console.log("Comment Middleware Up");
  const data: { content: string } = await req.json();

  if (!data || !data.content) {
    return NextResponse.json(
      { message: "Invalid Comment Data" },
      { status: 400 }
    );
  }
  try {
    const schema = getCommentSchema();
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
      throw new CustomError("Invalid Comment Data", 400, "", true, "", errors);
    } else {
      console.log("error checking for comment Data");
      throw error;
    }
  }
}

export async function editCommentMiddleware(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const data: { content: string; blogId: number } = await req.json();
    if (!data) {
      throw new CustomError("Invalid Comment Data", 400, "", true);
    }
    if (!data.blogId) {
      throw new CustomError("Invalid Blog ID", 400, "", true);
    }
    const schema = getCommentSchema();
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
      throw new CustomError("Invalid Comment Data", 400, "", true, "", errors);
    }
    throw error;
  }
}
