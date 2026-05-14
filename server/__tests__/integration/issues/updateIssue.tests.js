const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User, Issue, Comment, Location } = db;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const TEST_USER_ID = "b0000000-0000-4000-8000-000000000000";
const MOCK_ISSUE_ID = "c0000000-0000-4000-8000-000000000000";

describe("PUT /api/issues/:id (updateIssue)", () => {
  let validTestToken;
  let tempUser;
  let tempIssue;

  beforeAll(async () => {
    // 1. Initialize DB sync
    await db.sequelize.sync({ force: true });

    // 2. Strict cleanup loop to avoid cross-file state contamination
    if (Comment)
      await Comment.destroy({ truncate: { cascade: true }, force: true }).catch(
        () => null,
      );
    if (Location)
      await Location.destroy({
        truncate: { cascade: true },
        force: true,
      }).catch(() => null);
    if (Issue)
      await Issue.destroy({ truncate: { cascade: true }, force: true }).catch(
        () => null,
      );
    if (User)
      await User.destroy({ truncate: { cascade: true }, force: true }).catch(
        () => null,
      );

    validTestToken = jwt.sign(
      { id: TEST_USER_ID, email: "testuser@civiclens.com" },
      JWT_SECRET,
    );

    // 3. Seed mock entities cleanly
    if (User) {
      tempUser = await User.create({
        id: TEST_USER_ID,
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        city: "Los Angeles",
        email: "testuser@civiclens.com",
        password: "securepassword123",
      });
    }

    if (Issue) {
      tempIssue = await Issue.create({
        id: MOCK_ISSUE_ID,
        title: "Original Title",
        description: "Original description regarding pothole.",
        category: "Infrastructure",
        author_id: TEST_USER_ID,
      });
    }
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should return 401 if the accessToken is missing", async () => {
    const response = await request(app)
      .put(`/api/issues/${MOCK_ISSUE_ID}`)
      .send({ title: "Updated Title" });

    expect(response.status).toBe(401);
  });

  it("should return 400 if the provided issue ID is invalid/malformed", async () => {
    const response = await request(app)
      .put("/api/issues/not-a-valid-uuid")
      .set("Authorization", `Bearer ${validTestToken}`)
      .send({ title: "Updated Title" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid issue id");
  });

  it("should return 404 if the issue does not exist", async () => {
    const missingUuid = "f0000000-0000-4000-8000-000000000000";
    const response = await request(app)
      .put(`/api/issues/${missingUuid}`)
      .set("Authorization", `Bearer ${validTestToken}`)
      .send({ title: "Updated Title" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Issue not found");
  });

  it("should successfully update fields and return 200 with the updated entity", async () => {
    const updatedPayload = {
      title: "Completely New Title",
      description: "Updated description about the road quality.",
      status: "resolved",
    };

    const response = await request(app)
      .put(`/api/issues/${MOCK_ISSUE_ID}`)
      .set("Authorization", `Bearer ${validTestToken}`)
      .send(updatedPayload);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedPayload.title);
    expect(response.body.description).toBe(updatedPayload.description);
    expect(response.body.status).toBe(updatedPayload.status);

    // Confirm changes persisted in the database sandbox
    const updatedRecord = await Issue.findByPk(MOCK_ISSUE_ID);
    expect(updatedRecord.title).toBe(updatedPayload.title);
  });
});
