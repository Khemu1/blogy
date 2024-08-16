import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/database";
import { getUserModel } from "@/models/user";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const userId = Number(params.id);
    if (!userId || isNaN(userId) || userId <= 0) {
      return NextResponse.json({ message: "invalid Id" }, { status: 401 });
    }
    await connectDB();
    const User = await getUserModel();
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "something is wrong" },
      { status: 400 }
    );
  }
}
