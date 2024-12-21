// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/utils/database";
// import initializeBlogModel from "@/models/blog";
// interface Props {
//   params: { userId: number };
// }
// export async function GET(req: NextRequest, { params }: Props) {
//   try {
//     const t = typeof Number(params.userId);
//     if (t !== "number") {
//       return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
//     }
//     await connectDB();
//     const Blog = await initializeBlogModel();
//     const blogs = await Blog.findAll({
//       where: {
//         userId: params.userId,
//       },
//     });
//     if (blogs.length > 0) {
//       return Response.json(blogs, { status: 200 });
//     }
//     return new Response("Start Creating Blogs", { status: 200 });
//   } catch (error) {
//     console.error("Error fetching blog:", error);
//     return new Response("An error occurred", { status: 500 });
//   }
// }
