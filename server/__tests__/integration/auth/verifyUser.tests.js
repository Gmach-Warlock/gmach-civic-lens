require("dotenv").config();
process.env.JWT_SECRET = "testsecret";
process.env.JWT_REFRESH = "refreshsecret";
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User } = db;

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

const userDataTemplate = {
  username: "johndoe",
  email: "john@example.com",
  password: "Password123!",
  firstName: "John",
  lastName: "Doe",
  address: "123 Main St",
  city: "Los Angeles",
  zipCode: "90028",
};

describe("verifyUser route", () => {
  let validUser;
  let validToken;

  beforeAll(async () => {
    // Sync and ensure we have a fresh user
    await db.sequelize.sync({ force: true });

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(userDataTemplate.password, 12);

    validUser = await User.create({
      ...userDataTemplate,
      password: hashedPassword,
    });

    // Generate a valid token for this user to pass into our requests
    validToken = jwt.sign(
      { id: validUser.id, username: validUser.username },
      JWT_SECRET,
      { expiresIn: "1h" },
    );
  });

  it("should successfully verify a valid token and return fresh tokens with user data", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Token valid");
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");

    // Drill into your actual utility structure
    expect(response.body.user.general.username).toBe(validUser.username);
  });

  it("should return 401 if no authorization header is provided", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Authentication token required.");
  });

  it("should return 403 if the token is malformed or invalid", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer absolute_gibberish_token");

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Invalid or expired token.");
  });

  it("should return 404 if the token is valid but the user no longer exists", async () => {
    // Structural UUID that isn't tied to any real row
    const nonExistentUserId = "00000000-0000-0000-0000-000000000000";

    const transientToken = jwt.sign(
      { id: nonExistentUserId, username: "ghost" },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${transientToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should return 500 if an unexpected database error occurs during lookup", async () => {
    const findByPkSpy = jest
      .spyOn(User, "findByPk")
      .mockImplementationOnce(() => {
        throw new Error("Database timeout");
      });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Database timeout");

    findByPkSpy.mockRestore();
  });
});
