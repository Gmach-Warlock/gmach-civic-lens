const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const jwt = require("jsonwebtoken");
const { Issue, User, Comment } = db;

const JWT_SECRET = process.env.JWT_SECRET;
const TEST_USER_ID = "b0000000-0000-4000-8000-000000000000";

describe("Issue Model TDD = Database Integration", () => {
  let validTestToken;
  let tempUser;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // 2. Wipe tables completely using Sequelize models to clear old test artifacts
    if (Comment)
      await Comment.destroy({ truncate: { cascade: true }, force: true }).catch(
        () => null,
      );
    if (Issue)
      await Issue.destroy({ truncate: { cascade: true }, force: true }).catch(
        () => null,
      );
    if (User)
      await User.destroy({ truncate: { cascade: true }, force: true }).catch(
        () => null,
      );
    // Generate valid JWT token using the exact user ID
    validTestToken = jwt.sign(
      { id: TEST_USER_ID, email: "testuser@civiclens.com" },
      JWT_SECRET,
    );

    // Seed the user with all required fields to satisfy NOT NULL constraints
    if (User) {
      const [userInstance] = await User.findOrCreate({
        where: { id: TEST_USER_ID },
        defaults: {
          firstName: "Test",
          lastName: "User",
          username: "testuser",
          city: "Los Angeles",
          email: "testuser@civiclens.com",
          password: "securepassword123",
        },
      });
      tempUser = userInstance;
    }
  });

  afterAll(async () => {
    if (tempUser && User) {
      await User.destroy({ where: { id: TEST_USER_ID } }).catch(() => null);
    }
    await db.sequelize.close();
  });

  it("should return 400 if any required field is missing", async () => {
    const response = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${validTestToken}`)
      .send({ title: "Broken Light" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "All fields (title, description, category) are required.",
    );
  });

  it("should return 400 if title is too short", async () => {
    const response = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${validTestToken}`)
      .send({
        title: "Bad",
        description: "Street light flickering badly.",
        category: "UI",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "Title must be at least 5 characters",
    );
  });

  it("should create a new issue in the database", async () => {
    const response = await request(app)
      .post("/api/issues")
      .set("Authorization", `Bearer ${validTestToken}`)
      .send({
        title: "UI Flicker in Lobby",
        description: "The neon lights are flickering too fast.",
        category: "UI",
        lat: 34.0522,
        lng: -8.2437,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("issues");
  });
});
