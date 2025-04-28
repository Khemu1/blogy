import { NextResponse, NextRequest } from "next/server";
import { getCommentSchema, validateWithSchema } from "@/app/utils/comment";
import { ZodError } from "zod";
import { errorHandler } from "../error/ErrorHandler";

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
      return NextResponse.json(
        { errors: validateWithSchema(error) },
        { status: 400 }
      );
    } else {
      console.log("error checking for comment Data");
      return errorHandler(error, req);
    }
  }
}
