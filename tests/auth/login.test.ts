import { closeConnection, initializeDatabase } from "@/config/dbInit";
import { faker } from "@faker-js/faker";
import { closeRedis } from "@/app/utils/redis";
import { fetchHandler } from "../helpers/test-utils";

describe("/api/auth/login", () => {
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
      path: "/api/auth/login",
      body: {},
    });
    console.log(result);
    expect(result.status).toBe(400);
  });

  it("sending invalid account should return 400", async () => {
    const result = await fetchHandler({
      method: "POST",
      path: "/api/auth/login",
      body: {
        emailOrUsername: "invalid",
        password: "invalid",
      },
    });
    expect(result.status).toBe(400);
  });

  it("sending valid account and password should return 200", async () => {
    const fakeUsername = `${faker.person.firstName()}${faker.person.lastName()}`;
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password({ length: 12 });

    // First, register the user
    const registerResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/register",
      body: {
        username: fakeUsername,
        email: fakeEmail,
        password: fakePassword,
        confirmPassword: fakePassword,
      },
    });
    expect(registerResult.status).toBe(201);

    // Then, login
    const loginResult = await fetchHandler({
      method: "POST",
      path: "/api/auth/login",
      body: {
        emailOrUsername: fakeUsername,
        password: fakePassword,
      },
      cookies: registerResult.cookies,
    });
    expect(loginResult.status).toBe(200);
  });
});
