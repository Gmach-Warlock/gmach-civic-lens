const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User, Comment, Issue } = db;

const JWT_SECRET = process.env.JWT_SECRET;
const TEST_USER_ID = crypto.randomUUID();
const MOCK_ISSUE_ID = crypto.randomUUID();

describe("getAllComments route", () => {
  let validTestToken;
  let tempUser;
  let tempIssue;

  beforeAll(async () => {
    await db.sequelize.sync({ force: false });

    validTestToken = jwt.sign(
      { id: TEST_USER_ID, email: "testuser@civiclens.com" },
      JWT_SECRET,
    );

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

    if (Issue) {
      const [issueInstance] = await Issue.findOrCreate({
        where: { id: MOCK_ISSUE_ID },
        defaults: {
          title: "Test Civic Issue",
          description: "Pothole on Main St.",
          status: "open",
          category: "Infrastructure",
        },
      });
      tempIssue = issueInstance;
    }
  });

  afterAll(async () => {
    if (tempIssue && Issue) {
      await Issue.destroy({ where: { id: MOCK_ISSUE_ID } }).catch(() => null);
    }
    if (tempUser && User) {
      await User.destroy({ where: { id: TEST_USER_ID } }).catch(() => null);
    }
    await db.sequelize.close();
  });

  it("should return a 401 status if the token is not present", async () => {
    const response = await request(app).get("/api/comments/");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Authentication token required.");
  });

  it("should return 500 if an unexpected database error occurs", async () => {
    const findAllSpy = jest
      .spyOn(Issue, "findAll")
      .mockRejectedValueOnce(new Error("Database connection timed out"));

    const response = await request(app)
      .get("/api/issues")
      .set("Authorization", `Bearer ${validTestToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");

    findAllSpy.mockRestore();
  });

  it("should return the comments array if a valid access token is provided", async () => {
    const response = await request(app)
      .get("/api/comments")
      .set("Authorization", `Bearer ${validTestToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("comments");
    expect(Array.isArray(response.body.comments)).toBe(true);
  });
});
