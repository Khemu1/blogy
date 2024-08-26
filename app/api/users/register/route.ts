import { connectDB } from "@/utils/database";
import { getUserModel } from "@/models/user";
import { RegisterFormProps, UserProps } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { createTokens, cookieOptions } from "@/utils/auth";
import bcrypt from "bcrypt";

// Handles POST requests for user registration
export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as RegisterFormProps; // Parse JSON body

    // Since validation is handled by middleware, you can assume data is valid
    await connectDB();
    const User = await getUserModel();

    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ where: { username: data.username } }),
      User.findOne({ where: { email: data.email } }),
    ]);

    if (existingUsername) {
      return NextResponse.json(
        { username: "Username already exists" },
        { status: 400 }
      );
    }

    if (existingEmail) {
      return NextResponse.json(
        { email: "Email already exists" },
        { status: 400 }
      );
    }
    const userModifiedData = {
      username: data.username,
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
    };
    const newUserInstance = await User.create(userModifiedData);
    const newUser: UserProps = newUserInstance.toJSON();

    const { accessToken, refreshToken } = await createTokens(newUser.id);
    const response = NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
    response.headers.set("Authorization", `Bearer  ${accessToken}`);
    response.cookies.set("refreshToken", refreshToken, cookieOptions);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
