const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");

describe("Users API (/api/auth/register)", () => {
  // 1. Sync the database once before running any user tests
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  describe("POST /api/auth/register", () => {
    // --- HAPPY PATH ---
    it("should return 201, generate tokens, and return the formatted user on success", async () => {
      const validUser = {
        username: "johndoe",
        email: "john@example.com",
        password: "Password123!",
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "Los Angeles",
        zipCode: "90028",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      // Root level properties
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "User created!");
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");

      // Nested "user.general" checks (Matches your factory helper)
      expect(response.body.user.general).toHaveProperty("username", "johndoe");
      expect(response.body.user.general).toHaveProperty(
        "email",
        "john@example.com",
      );
      expect(response.body.user.general).toHaveProperty("firstName", "John");
      expect(response.body.user.general).toHaveProperty("lastName", "Doe");
      expect(response.body.user.general).toHaveProperty(
        "address",
        "123 Main St",
      );
      expect(response.body.user.general).toHaveProperty("city", "Los Angeles");
      expect(response.body.user.general).toHaveProperty("zipCode", "90028");

      // Nested "user.meta" checks
      expect(response.body.user.meta).toHaveProperty("isAdmin", false);
      expect(response.body.user.meta).toHaveProperty("createdAt");
      expect(response.body.user.meta).toHaveProperty("lastLogin");

      // Nested "activity" checks
      expect(response.body.activity).toHaveProperty("requests");
      expect(response.body.activity).toHaveProperty("comments");
      expect(Array.isArray(response.body.activity.requests)).toBe(true);
      expect(Array.isArray(response.body.activity.comments)).toBe(true);

      // Crucial Security Test: Ensure the plain password is NOT leaked in the response body!
      expect(response.body).not.toHaveProperty("password");
      expect(response.body.user.general).not.toHaveProperty("password");
    });

    // --- LAYER 1: EXISTENCE GUARD ---
    it("should return 400 if any required field is missing", async () => {
      const incompleteUser = {
        username: "missing_fields_guy",
        email: "missing@example.com",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("All fields are required.");
    });

    // --- LAYER 2: TYPE GUARD ---
    it("should return 400 if fields are not strings (prevents regex crashes)", async () => {
      const invalidTypesUser = {
        username: "validusername",
        email: "valid@email.com",
        password: ["Not", "A", "String"],
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "Los Angeles",
        zipCode: 90028,
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidTypesUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("All fields must be strings.");
    });

    it("should return 400 if the password is weak", async () => {
      const weakPasswordUser = {
        username: "weakpwd",
        email: "weak@example.com",
        password: "123",
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "Los Angeles",
        zipCode: "90028",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(weakPasswordUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain(
        "Password must be at least 8 characters long",
      );
    });

    it("should return 400 if the email format is invalid", async () => {
      const badEmailUser = {
        username: "bademail",
        email: "not-an-email-at-all",
        password: "Password123!",
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "Los Angeles",
        zipCode: "90028",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(badEmailUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid email format.");
    });

    it("should return 400 if the zip code format is invalid", async () => {
      const badZipUser = {
        username: "badzip",
        email: "zipguy@example.com",
        password: "Password123!",
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "Los Angeles",
        zipCode: "9021-bad-zip", // Invalid format
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(badZipUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid zip code format.");
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});
