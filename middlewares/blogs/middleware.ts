import { NextResponse, NextRequest } from "next/server";
import { getNewBlogSchema, validateWithSchema } from "@/app/utils/blog";
import { ZodError } from "zod";
import { errorHandler } from "../error/ErrorHandler";

export async function addBlogMiddleware(req: NextRequest, res: NextResponse) {
  const data: { title: string; content: string } = await req.json();
  if (!data || !data.title || !data.content) {
    return NextResponse.json({ message: "Invalid Blog Data" }, { status: 400 });
  }
  try {
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
      return NextResponse.json(
        { errors: validateWithSchema(error) },
        { status: 400 }
      );
    } else {
      return errorHandler(error, req);
    }
  }
}
