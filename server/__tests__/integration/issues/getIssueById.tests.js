require("dotenv").config();
const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const jwt = require("jsonwebtoken");
const { Issue, User } = db;

const JWT_SECRET = process.env.JWT_SECRET || "your_test_jwt_secret";
const TEST_USER_ID = "b0000000-0000-4000-8000-000000000000";

describe("GET issue by ID", () => {
  let tempIssue;
  let tempUser;
  let validTestToken;

  beforeAll(async () => {
    await db.sequelize.sync({ force: false });

    // 1. Generate valid token
    validTestToken = jwt.sign(
      {
        id: TEST_USER_ID,
        email: "testuser@civiclens.com",
      },
      JWT_SECRET,
    );

    // 2. Seed User with required schema fields
    if (User) {
      const [userInstance] = await User.findOrCreate({
        where: { id: TEST_USER_ID },
        defaults: {
          firstName: "Get",
          lastName: "Tester",
          username: "gettester",
          city: "Los Angeles",
          email: "testuser@civiclens.com",
          password: "securepassword123",
        },
      });
      tempUser = userInstance;
    }

    // 3. Create the dummy issue linking to our seed user
    if (Issue) {
      tempIssue = await Issue.create({
        id: "f0000000-0000-4000-8000-000000000000",
        title: "Test Issue",
        description: "This is a temporary test issue",
        status: "open",
        category: "test",
        author_id: TEST_USER_ID,
      }).catch((err) => {
        console.error("Failed to seed issue in beforeAll:", err.message);
        return null;
      });
    }
  });

  afterAll(async () => {
    if (tempIssue && Issue) {
      await Issue.destroy({ where: { id: tempIssue.id } }).catch(() => null);
    }
    if (tempUser && User) {
      await User.destroy({ where: { id: TEST_USER_ID } }).catch(() => null);
    }
  });

  // --- RAIL 1: Invalid Format Guard (400) ---
  it("should return a status of 400, and a message asking for valid inputs if the id is invalid", async () => {
    const response = await request(app)
      .get("/api/issues/not-a-valid-uuid")
      .set("Authorization", `Bearer ${validTestToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid issue id");
  });

  // --- RAIL 2: Valid Format but Doesn't Exist (404) ---
  it("should return a status of 404 and a message 'Issue not found' if the issue does not exist", async () => {
    const nonExistentUuid = "a0000000-0000-0000-0000-000000000000";

    const response = await request(app)
      .get(`/api/issues/${nonExistentUuid}`)
      .set("Authorization", `Bearer ${validTestToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Issue not found");
  });

  // --- RAIL 3: Database/Server Crashes (500) ---
  it("should return a status of 500 if an unexpected database error occurs", async () => {
    const findByPkSpy = jest
      .spyOn(Issue, "findByPk")
      .mockImplementationOnce(() => {
        throw new Error("Database connection lost");
      });

    const validUuid = "12345678-1234-1234-1234-123456789012";
    const response = await request(app)
      .get(`/api/issues/${validUuid}`)
      .set("Authorization", `Bearer ${validTestToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");

    findByPkSpy.mockRestore();
  });

  // --- RAIL 4: Success Case (200) ---
  it("should have an issue key", async () => {
    expect(tempIssue).toBeDefined();

    const response = await request(app)
      .get(`/api/issues/${tempIssue.id}`)
      .set("Authorization", `Bearer ${validTestToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("issue");
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
