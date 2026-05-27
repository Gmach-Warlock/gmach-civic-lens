const request = require("supertest");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User, Comment, Issue } = db;

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_test_key";
const TEST_USER_ID = crypto.randomUUID();
const MOCK_ISSUE_ID = crypto.randomUUID();
const MOCK_COMMENT_ID = crypto.randomUUID();

describe("getCommentById route", () => {
  let validTestToken;

  beforeAll(async () => {
    await db.sequelize.sync({ force: false });

    if (Comment)
      await Comment.destroy({ truncate: { cascade: true }, force: true });
    if (Issue)
      await Issue.destroy({ truncate: { cascade: true }, force: true });
    if (User) await User.destroy({ truncate: { cascade: true }, force: true });

    validTestToken = jwt.sign(
      { id: TEST_USER_ID, email: "testuser@civiclens.com" },
      JWT_SECRET,
    );

    // 1. Seed User
    if (User) {
      await User.findOrCreate({
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
    }

    // 2. Seed Issue
    if (Issue) {
      await Issue.findOrCreate({
        where: { id: MOCK_ISSUE_ID },
        defaults: {
          title: "Test Civic Issue",
          description: "Pothole on Main St.",
          status: "open",
          category: "Infrastructure",
          author_id: TEST_USER_ID, // --- FIXED: Constraint satisfied ---
        },
      });
    }

    // 3. Seed the Target Comment for our 200 test
    if (Comment) {
      await Comment.findOrCreate({
        where: { id: MOCK_COMMENT_ID },
        defaults: {
          content: "This is a targeted test comment.",
          issue_id: MOCK_ISSUE_ID,
          author_id: TEST_USER_ID,
        },
      });
    }
  });

  afterAll(async () => {
    if (Comment) {
      await Comment.destroy({ where: { id: MOCK_COMMENT_ID } }).catch(
        () => null,
      );
    }
    if (Issue) {
      await Issue.destroy({ where: { id: MOCK_ISSUE_ID } }).catch(() => null);
    }
    if (User) {
      await User.destroy({ where: { id: TEST_USER_ID } }).catch(() => null);
    }
    await db.sequelize.close();
  });

  it("should return a 401 status if the token is not present", async () => {
    const response = await request(app).get(`/api/comments/${MOCK_COMMENT_ID}`);
    expect(response.status).toBe(401);
  });

  it("should return 404 if the comment does not exist", async () => {
    const fakeUuid = crypto.randomUUID();
    const response = await request(app)
      .get(`/api/comments/${fakeUuid}`)
      .set("Authorization", `Bearer ${validTestToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Comment not found.");
  });

  it("should return the specific comment if a valid ID and token are provided", async () => {
    const response = await request(app)
      .get(`/api/comments/${MOCK_COMMENT_ID}`)
      .set("Authorization", `Bearer ${validTestToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("comment");
    expect(response.body.comment.id).toBe(MOCK_COMMENT_ID);
    expect(response.body.comment.content).toBe(
      "This is a targeted test comment.",
    );
  });
});
