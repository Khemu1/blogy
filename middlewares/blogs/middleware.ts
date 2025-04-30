import { NextResponse, NextRequest } from "next/server";
import { getNewBlogSchema } from "@/app/utils/blog";
import { ZodError } from "zod";
import { CustomError } from "../error/CustomError";
import { validateWithSchema } from "@/app/utils/comment";

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
      const errors = validateWithSchema(error);
      throw new CustomError("Invalid Blog Data", 400, "", true, "", errors);
    }
    throw error;
  }
}
