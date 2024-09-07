import { NewCommentProps } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/database";
import initializeCommentModel from "@/models/comment";
import initializeUserModel from "@/models/user";

interface CommentParams {
  params: { blogId: number };
}
export async function GET(req: NextRequest, { params }: CommentParams) {
  const userId = typeof Number(req.headers.get("X-User-Id")) === "number";

  try {
    if (isNaN(params.blogId)) {
      return Response.json({ message: "Invalid Data" }, { status: 400 });
    }
    await connectDB();
    const Comment = await initializeCommentModel();

    const sequelize = (Comment as any).sequelize;
    if (!sequelize) {
      throw new Error("Sequelize instance is not defined on the Comment model");
    }

    const comments = await Comment.findAll({
      where: { blogId: params.blogId },
      order: [
        [
          sequelize.literal(
            `CASE WHEN userId = ${Number(userId)} THEN 0 ELSE 1 END`
          ),
          "ASC",
        ],
      ],
    });

    return Response.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return Response.json(
      { message: "Unexpected Error Occured" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: CommentParams) {
  try {
    const userId = Number(req.headers.get("X-User-Id"));
    if (isNaN(params.blogId) || typeof userId !== "number") {
      return Response.json(
        { message: "Invalid Comment or User" },
        { status: 400 }
      );
    }
    const data: { comment: string; blogId: number } = await req.json();
    await connectDB();
    const Comment = await initializeCommentModel();
    const User = await initializeUserModel();
    const user = await User.findByPk(userId, {
      attributes: ["username"],
    });
    Comment.create({ ...data, userId: userId, author: user?.username });

    return Response.json("Comment Added", { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return Response.json(
      { message: "Unexpected Error Occured" },
      { status: 500 }
    );
  }
}
