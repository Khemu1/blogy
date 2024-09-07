import { NewCommentProps } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/database";
import initializeCommentModel from "@/models/comment";
import initializeUserModel from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const data: { comment: NewCommentProps; blogId: number } = await req.json();
    const userId = Number(req.headers.get("X-User-Id")?.valueOf);
    if (!data.comment || !data.blogId || isNaN(userId)) {
      return Response.json({ message: "Invalid data" }, { status: 400 });
    }
    await connectDB();
    const Comment = await initializeCommentModel();
    const User = await initializeUserModel();
    const user = await User.findByPk(userId, {
      attributes: ["username"],
    });
    await Comment.create({ ...data.comment, userId, author: user?.username });
    return Response.json(
      { message: "Comment created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return Response.json(
      { message: "Unexpected Error Occured" },
      { status: 500 }
    );
  }
}
