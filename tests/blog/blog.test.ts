import { closeRedis } from "@/app/utils/redis";
import { initializeDatabase, closeConnection } from "@/config/dbInit";
import { returnNewUser } from "../factories/user";
import { fetchHandler } from "../helpers/test-utils";

describe("/api/blog", () => {
  const blog = {
    title: "test",
    content: "test",
  };

  beforeEach(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeConnection();
    await closeRedis();
  });

  it("should throw 500 when not sending body", async () => {
    const registerResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: returnNewUser(),
    });
    expect(registerResult.status).toBe(201);

    const blogResult = await fetchHandler({
      method: "POST",
      path: "/api/blogs",
      cookies: registerResult.cookies,
    });
    expect(blogResult.status).toBe(500);
  });

  it("should throw 400 when sending an empty body", async () => {
    const registerResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: returnNewUser(),
    });
    expect(registerResult.status).toBe(201);

    const blogResult = await fetchHandler({
      method: "POST",
      path: "/api/blogs",
      body: {},
      cookies: registerResult.cookies,
    });
    expect(blogResult.status).toBe(400);
  });

  it("should create a blog when sending valid data", async () => {
    const registerResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: returnNewUser(),
    });
    expect(registerResult.status).toBe(201);

    const blogResult = await fetchHandler({
      method: "POST",
      path: "/api/blogs",
      body: blog,
      cookies: registerResult.cookies,
    });
    expect(blogResult.status).toBe(201);
  });

  it("delete created blog", async () => {
    const registerResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: returnNewUser(),
    });
    expect(registerResult.status).toBe(201);

    const blogResult = await fetchHandler({
      method: "POST",
      path: "/api/blogs",
      body: blog,
      cookies: registerResult.cookies,
    });
    expect(blogResult.status).toBe(201);

    const deleteResult = await fetchHandler({
      method: "DELETE",
      path: `/api/blogs/${blogResult.body.blogId}`,
      cookies: registerResult.cookies,
    });
    expect(deleteResult.status).toBe(204);
  });

  it("edit blog and check if it's updated", async () => {
    const registerResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: returnNewUser(),
    });
    expect(registerResult.status).toBe(201);

    const blogResult = await fetchHandler({
      method: "POST",
      path: "/api/blogs",
      body: blog,
      cookies: registerResult.cookies,
    });
    expect(blogResult.status).toBe(201);

    const editBlogResult = await fetchHandler({
      method: "PUT",
      path: `/api/blogs/${blogResult.body.blogId}`,
      body: {
        title: "new title",
        content: "new content",
      },
      cookies: registerResult.cookies,
    });
    console.log("editBlogResult", editBlogResult.body);
    expect(editBlogResult.status).toBe(200);
    expect(editBlogResult.body.title).toBe("new title");
    expect(editBlogResult.body.content).toBe("new content");
  });
});
