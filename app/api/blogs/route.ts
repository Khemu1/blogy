import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/database";
import initializeBlogModel from "@/models/blog";
import initializeUserModel from "@/models/user";
import { getBlogsParams, getPageNumber } from "@/services/blogUtils";
import { Op } from "sequelize";

export async function GET(req: NextRequest) {
  try {
    const { searchParams, ordering } = getBlogsParams(req);
    await connectDB();
    const Blog = await initializeBlogModel();

    // Initialize an empty object to build the search condition
    let whereClause: any = {};

    // Check if both search parameters are provided
    if (searchParams.q && searchParams.searchBy) {
      // Use the value of searchParams.searchBy as the key (e.g., "author", "title", etc.)
      // Create a search condition for the field with a case-insensitive partial match
      // Note: Brackets [] are used to dynamically access the object key
      whereClause[searchParams.searchBy] = {
        [Op.iLike]: `%${searchParams.q}%`, // `Op.iLike` is used for case-insensitive matching
      };
      // Example result if searchParams.q = 'art1' and searchParams.searchBy = 'title':
      // { title: { [Op.iLike]: '%art1%' } }
    }

    const pageNumber = getPageNumber(req);
    const limit = 5;

    const totalBlogs = await Blog.count({ where: whereClause });
    console.log(totalBlogs);
    const blogs = await Blog.findAll({
      where: whereClause,
      limit: limit,
      offset: (pageNumber - 1) * 5, // Calculate the offset for pagination
      order: [ordering],
    });

    const totalPages = Math.ceil(totalBlogs / limit);

    return Response.json({ blogs, totalPages: totalPages }, { status: 200 });
  } catch (error) {
    console.log(error);
    console.error("Error fetching blog:");
    return new Response("An error occurred", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const userId = Number(req.headers.get("X-User-Id"));
    if (!userId || typeof Number(userId) !== "number") {
      console.log(userId);
      return NextResponse.json({ message: "Invalid User" }, { status: 401 });
    }

    // Your existing code to handle request data
    await connectDB();
    const Blog = await initializeBlogModel();
    const User = await initializeUserModel();
    const user = await User.findByPk(userId, {
      attributes: ["username"],
    });
    const blog = await Blog.create({
      ...data,
      userId: userId,
      author: user?.username,
    });
    let response = NextResponse.json({ blogId: blog.id }, { status: 201 });
    response.cookies.delete("userId");
    return response;
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
