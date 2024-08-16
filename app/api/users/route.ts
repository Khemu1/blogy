import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/database";
import User from "@/models/user";
import { validateNewUser } from "@/middlewares/users/newUser";
import { UserProps } from "@/types";
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const users = await User.findAll();
    const se = users.length !== 0 ? "have" : "empty";
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json("something is wrong", { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    
    const { validatedUser, errors } = await validateNewUser({ name, email });

    if (errors) {
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    if (!validatedUser) {
      return NextResponse.json(
        { message: "No valid user data" },
        { status: 400 }
      );
    }

    await connectDB();

    const newUserInstance = await User.create(validatedUser);
    const newUser: UserProps = newUserInstance.toJSON();

    if (newUser) return NextResponse.json(newUser.name, { status: 201 });

    return NextResponse.json(
      { message: "User creation failed" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
