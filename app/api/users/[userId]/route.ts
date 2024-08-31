import { NextRequest } from "next/server";
import { connectDB } from "@/utils/database";
import initializeUserModel from "@/models/user";
interface Props {
  params: { userId: number };
}
export async function GET(req: NextRequest, { params }: Props) {
  try {
    if (Number(params.userId)) {
      return new Response(JSON.stringify(typeof params.userId), {
        status: 400,
      });
    }
    await connectDB();
    const User = await initializeUserModel();
    const user = await User.findByPk(params.userId);
    if (!user) {
      return new Response("User Not Found", { status: 404 });
    }
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return new Response("An error occurred", { status: 500 });
  }
}
