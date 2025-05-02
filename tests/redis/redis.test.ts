import { closeRedis, redis } from "@/app/utils/redis";
import { initializeDatabase, closeConnection } from "@/config/dbInit";
import { fetchHandler } from "../helpers/test-utils";

describe("Rate Limit Testing", () => {
  const TEST_IP = "192.168.1.1";
  const RATE_LIMIT = {
    WINDOW_SECONDS: 60,
    MAX_REQUESTS: 60,
  };

  beforeEach(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeConnection();
    await closeRedis();
  });

  it("should allow first request", async () => {
    // Verify single request works
    const response = await fetchHandler({
      method: "POST",
      path: "/api/auth/login",
      body: { emailOrUsername: "test@example.com", password: "wrongpass" },
      headers: { "x-forwarded-for": TEST_IP },
    });

    console.log("First request status:", response.status);
    expect(response.status).not.toBe(429);
  });

  it("should block after limit", async () => {
    // Verify we start clean
    await redis.del(`rate_limit:${TEST_IP}`);

    // Send exactly MAX_REQUESTS
    const promises = [];
    for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS; i++) {
      promises.push(
        fetchHandler({
          method: "POST",
          path: "/api/auth/login",
          body: { emailOrUsername: "test@example.com", password: "wrongpass" },
          headers: { "x-forwarded-for": TEST_IP },
        })
      );
    }

    const results = await Promise.all(promises);
    const blocked = results.filter((r) => r.status === 429).length;
    console.log(`Blocked during limit: ${blocked}`);
    expect(blocked).toBe(0);

    const overLimit = await fetchHandler({
      method: "POST",
      path: "/api/auth/login",
      body: { emailOrUsername: "test@example.com", password: "wrongpass" },
      headers: { "x-forwarded-for": TEST_IP },
    });
    expect(overLimit.status).toBe(429);
  });
});
