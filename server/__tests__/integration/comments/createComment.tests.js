const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User, Comment, Issue } = db;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const TEST_USER_ID = "b0000000-0000-4000-8000-000000000000";
const MOCK_ISSUE_ID = "c0000000-0000-4000-8000-000000000000";

describe("createComment route", () => {
  let validTestToken;
  let tempUser;
  let tempIssue;

  const validCommentPayload = {
    content: "This is a valid comment about the civic issue.",
    issue_id: MOCK_ISSUE_ID,
  };

  beforeAll(async () => {
    await db.sequelize.sync({ force: false });

    // Clear data safely using Sequelize hooks which handles table names perfectly
    if (Comment)
      await Comment.destroy({ truncate: { cascade: true }, force: true });
    if (Issue)
      await Issue.destroy({ truncate: { cascade: true }, force: true });
    if (User) await User.destroy({ truncate: { cascade: true }, force: true });

    if (Issue)
      await Issue.destroy({ where: { id: MOCK_ISSUE_ID } }).catch(() => null);
    if (User)
      await User.destroy({ where: { id: TEST_USER_ID } }).catch(() => null);

    validTestToken = jwt.sign(
      { id: TEST_USER_ID, email: "testuser@civiclens.com" },
      JWT_SECRET,
    );

    // Seed the user
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

    // 2. Seed the parent Issue to satisfy the foreign key constraint
    if (Issue) {
      const [issueInstance] = await Issue.findOrCreate({
        where: { id: MOCK_ISSUE_ID },
        defaults: {
          title: "Test Civic Issue",
          description: "Pothole on Main St.",
          status: "open",
          category: "Infrastructure",
          // Add any other required fields your Issue model demands here
        },
      });
      tempIssue = issueInstance;
    }
  });

  afterAll(async () => {
    // 3. Clean up the seeded records in reverse order
    if (tempIssue && Issue) {
      await Issue.destroy({ where: { id: MOCK_ISSUE_ID } }).catch(() => null);
    }
    if (tempUser && User) {
      await User.destroy({ where: { id: TEST_USER_ID } }).catch(() => null);
    }
    await db.sequelize.close();
  });

  it("should return 401/403 if the accessToken is missing", async () => {
    const response = await request(app)
      .post("/api/comments/")
      .send(validCommentPayload);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Authentication token required.");
  });

  it("should return 400 if the required inputs are missing", async () => {
    const response = await request(app)
      .post("/api/comments/")
      .set("Authorization", `Bearer ${validTestToken}`)
      .send({}); // Empty payload

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Please provide all the required information on your form!",
    );
  });

  it("should return 400 if fields are not strings which need to be", async () => {
    const invalidTypesComment = {
      ...validCommentPayload,
      content: ["Not", "A", "String"],
    };

    const response = await request(app)
      .post("/api/comments/")
      .set("Authorization", `Bearer ${validTestToken}`)
      .send(invalidTypesComment);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Please make sure all of your inputs are of proper type!",
    );
  });

  it("should return 400 if any html is present in any of the inputs", async () => {
    const maliciousComment = {
      ...validCommentPayload,
      content: "<script>alert('xss')</script> This is bad.",
    };

    const response = await request(app)
      .post("/api/comments/")
      .set("Authorization", `Bearer ${validTestToken}`)
      .send(maliciousComment);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No code is allowed in input fields!");
  });

  it("should return 500 if there is an internal database error", async () => {
    const targetModel = db.Comment || db.sequelize.models.Comment;
    const dbSpy = jest
      .spyOn(targetModel, "create")
      .mockRejectedValue(new Error("Database connection loss"));

    try {
      const response = await request(app)
        .post("/api/comments/")
        .set("Authorization", `Bearer ${validTestToken}`)
        .send(validCommentPayload);

      expect(response.status).toBe(500);
    } finally {
      dbSpy.mockRestore();
    }
  });

  it("should return a 200 status, and a confirmation message", async () => {
    const response = await request(app)
      .post("/api/comments/")
      .set("Authorization", `Bearer ${validTestToken}`)
      .send(validCommentPayload);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment successfully created!");
  });
});
