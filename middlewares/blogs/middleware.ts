import { NextResponse, NextRequest } from "next/server";
import { getNewBlogSchema, validateWithSchema } from "@/utils/blog";
import { ZodError } from "zod";

export async function addBlogMiddleware(req: NextRequest) {
  console.log("blog Middleware Up");
  const data: { title: string; content: string } = await req.json();

  if (!data || !data.title || !data.content) {
    return NextResponse.json({ message: "Invalid Blog Data" }, { status: 400 });
  }
  try {
    const schema = getNewBlogSchema();
    await schema.parseAsync(data);
    return NextResponse.next();
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { errors: validateWithSchema(error) },
        { status: 400 }
      );
    } else {
      console.error("Error adding blog:");
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}
