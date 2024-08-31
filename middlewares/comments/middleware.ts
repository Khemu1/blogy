import { NewCommentProps } from "@/types";
import { NextRequest } from "next/server";

export async function addCommentMiddleware(req: NextRequest) {
  const data: { comment: NewCommentProps; blogId: number } = await req.json();
  if (!data.comment || !data.blogId) {
    return Response.json("Invalid data", { status: 400 });
  }
  console.log(req);
  return Response.json(req);
}
