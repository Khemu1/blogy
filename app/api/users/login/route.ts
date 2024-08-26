// app/api/users/login/route.ts
import { Op } from "sequelize";
import { connectDB } from "@/utils/database";
import { getUserModel } from "@/models/user";
import { LoginFormProps, UserProps } from "@/types";
import { NextResponse, NextRequest } from "next/server";
import { createTokens, cookieOptions } from "@/utils/auth";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as LoginFormProps;

    if (!data) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await connectDB();
    const User = await getUserModel();

    const user = (await User.findOne({
      where: {
        [Op.or]: [
          { email: data.emailOrUsername },
          { username: data.emailOrUsername },
        ],
      },
    })) as UserProps | null;

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const { accessToken, refreshToken } = await createTokens(user.id);

    const response = NextResponse.json(
      { message: "Logged in successfully" },
      { status: 200 }
    );
    response.headers.set("Authorization", `Bearer ${accessToken}`);
    response.cookies.set("refreshToken", refreshToken, cookieOptions);

    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
