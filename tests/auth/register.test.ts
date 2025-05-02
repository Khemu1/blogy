import { faker } from "@faker-js/faker";
import { closeRedis } from "@/app/utils/redis";
import { closeConnection, initializeDatabase } from "@/config/dbInit";
import { fetchHandler } from "../helpers/test-utils";

describe("POST /api/auth/register", () => {
  beforeEach(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeConnection();
    await closeRedis();
  });

  it("sending empty body should return 400", async () => {
    const result = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: {},
    });

    expect(result.status).toBe(400);
  });

  it("sending valid account and password should return 201", async () => {
    const fakeUsername = `${faker.person.firstName()}${faker.person.lastName()}`;
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password({ length: 12 });

    const result = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: {
        username: fakeUsername,
        email: fakeEmail,
        password: fakePassword,
        confirmPassword: fakePassword,
      },
    });

    expect(result.status).toBe(201);
  });
});
