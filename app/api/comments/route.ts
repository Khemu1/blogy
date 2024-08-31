import { NewCommentProps } from "@/types";
import { NextRequest } from "next/server";
import { connectDB } from "@/utils/database";
import  initializeCommentModel  from "@/models/comment";

export async function POST(req: NextRequest) {
  try {
    const data:{comment:NewCommentProps,blogId:number} = await req.json();
    if (!data.comment || !data.blogId) { 
      return  Response.json("Invalid data", { status: 400 });
    }
    await connectDB();
    const comment = await initializeCommentModel();
    await comment.create({...data.comment, blogId: data.blogId });
  } catch (error) {
    console.error("Error creating comment:", error);
    return Response.json("An error occurred", { status: 500 });
  }
}