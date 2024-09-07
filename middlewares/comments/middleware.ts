import { NextResponse, NextRequest } from "next/server";
import { getCommentSchema, validateWithSchema } from "@/utils/comment";
import { ZodError } from "zod";

export async function addCommentMiddleware(req: NextRequest) {
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
