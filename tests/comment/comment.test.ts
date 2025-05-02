import { closeRedis } from "@/app/utils/redis";
import { initializeDatabase, closeConnection } from "@/config/dbInit";
import { returnNewUser } from "../factories/user";
import { getRandomBlogService } from "@/services/blogServices";
import { fetchHandler } from "../helpers/test-utils";

describe("/api/comment", () => {
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

    const commentResult = await fetchHandler({
      method: "POST",
      path: "/api/comments",
      cookies: registerResult.cookies,
    });
    expect(commentResult.status).toBe(500);
  });

  it("should throw 400 when sending an empty body", async () => {
    const registerResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: returnNewUser(),
    });
    expect(registerResult.status).toBe(201);

    const commentResult = await fetchHandler({
      method: "POST",
      path: "/api/comments",
      body: {},
      cookies: registerResult.cookies,
    });
    expect(commentResult.status).toBe(400);
  });

  it("should create a comment when sending valid data", async () => {
    const registerResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: returnNewUser(),
    });
    expect(registerResult.status).toBe(201);

    const randomBlog = await getRandomBlogService();
    expect(randomBlog.length).toBe(1);
    const blogId = randomBlog[0].id;
    expect(blogId).toBeDefined();

    const commentResult = await fetchHandler({
      method: "POST",
      path: "/api/comments",
      body: {
        blogId: blogId,
        content: "This is a comment",
      },
      cookies: registerResult.cookies,
    });
    expect(commentResult.status).toBe(201);
    expect(commentResult.body.message).toBe("Comment created successfully");
    expect(commentResult.body.comment.content).toBe("This is a comment");
  });

  it("should delete a comment when sending valid data", async () => {
    const registerResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: returnNewUser(),
    });
    expect(registerResult.status).toBe(201);

    const randomBlog = await getRandomBlogService();
    expect(randomBlog.length).toBe(1);
    const blogId = randomBlog[0].id;
    expect(blogId).toBeDefined();

    const commentResult = await fetchHandler({
      method: "POST",
      path: "/api/comments",
      body: {
        blogId: blogId,
        content: "This is a comment",
      },
      cookies: registerResult.cookies,
    });
    expect(commentResult.status).toBe(201);

    const deleteCommentResult = await fetchHandler({
      method: "DELETE",
      path: `/api/comments/${commentResult.body.comment.id}`,
      cookies: registerResult.cookies,
    });
    expect(deleteCommentResult.status).toBe(204);
  });

  it("should update a comment when sending valid data", async () => {
    const registerResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: returnNewUser(),
    });
    expect(registerResult.status).toBe(201);

    const randomBlog = await getRandomBlogService();
    expect(randomBlog.length).toBe(1);
    const blogId = randomBlog[0].id;
    expect(blogId).toBeDefined();

    const commentResult = await fetchHandler({
      method: "POST",
      path: "/api/comments",
      body: {
        blogId: blogId,
        content: "This is a comment",
      },
      cookies: registerResult.cookies,
    });
    expect(commentResult.status).toBe(201);

    const updateCommentResult = await fetchHandler({
      method: "PATCH",
      path: `/api/comments/${commentResult.body.comment.id}`,
      body: {
        content: "This is an updated comment",
        blogId: blogId,
      },
      cookies: registerResult.cookies,
    });
    expect(updateCommentResult.status).toBe(200);
    expect(updateCommentResult.body.content).toBe("This is an updated comment");
    expect(updateCommentResult.body.blogId).toBe(blogId);
  });
});
