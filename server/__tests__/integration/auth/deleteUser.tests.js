require("dotenv").config();
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User } = db;

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

const userDataTemplate = {
  username: "deletedjoe",
  email: "joe@example.com",
  password: "Password123!",
  firstName: "Joe",
  lastName: "Doe",
  address: "123 Main St",
  city: "Los Angeles",
  zipCode: "90028",
};

describe("deleteUser route (Soft Delete)", () => {
  let validUser;
  let validToken;

  beforeEach(async () => {
    // Reset DB state before each test block so assertions don't pollute each other
    await db.sequelize.sync({ force: true });

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(userDataTemplate.password, 12);

    validUser = await User.create({
      ...userDataTemplate,
      password: hashedPassword,
    });

    validToken = jwt.sign(
      { id: validUser.id, username: validUser.username },
      JWT_SECRET,
      { expiresIn: "1h" },
    );
  });

  it("should successfully soft-delete an authenticated user profile", async () => {
    const response = await request(app)
      .delete("/api/auth/me")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Account deactivated successfully");

    // Verify the record still physically exists in the database (Soft Deleted)
    // If you are using Sequelize paranoid tables, lookups require { paranoid: false }
    const dbCheck = await User.findByPk(validUser.id, { paranoid: false });
    expect(dbCheck).not.toBeNull();
    expect(dbCheck.deletedAt).not.toBeNull(); // Verifies paranoid timestamp is captured
  });

  it("should block subsequent requests using a token from a soft-deleted user", async () => {
    // 1. Fire the delete request
    await request(app)
      .delete("/api/auth/me")
      .set("Authorization", `Bearer ${validToken}`);

    // 2. Immediately try to use that same valid token to fetch user profile details
    const profileResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${validToken}`);

    // Your middleware or controller lookup should see the user doesn't exist anymore
    expect(profileResponse.status).toBe(404);
    expect(profileResponse.body.error).toBe("User not found");
  });

  it("should return a status of 500 if an unexpected database error occurs during destruction", async () => {
    const destroySpy = jest
      .spyOn(User, "destroy")
      .mockImplementationOnce(() => {
        throw new Error("Database deletion failed");
      });

    const response = await request(app)
      .delete("/api/auth/me")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Database deletion failed");

    destroySpy.mockRestore();
  });
});
