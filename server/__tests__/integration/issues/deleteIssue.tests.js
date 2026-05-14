const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User, Issue, Comment, Location } = db;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const AUTHOR_USER_ID = "b0000000-0000-4000-8000-000000000001";
const STRANGER_USER_ID = "b0000000-0000-4000-8000-000000000002";
const MOCK_ISSUE_ID = "c0000000-0000-4000-8000-000000000000";

describe("DELETE /api/issues/:id (deleteIssue)", () => {
  let authorToken;
  let strangerToken;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // Isolate test sandbox state
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

    // Generate tokens for both authorized and unauthorized clients
    authorToken = jwt.sign(
      { id: AUTHOR_USER_ID, email: "author@civiclens.com" },
      JWT_SECRET,
    );
    strangerToken = jwt.sign(
      { id: STRANGER_USER_ID, email: "stranger@civiclens.com" },
      JWT_SECRET,
    );

    // Seed users
    await User.create({
      id: AUTHOR_USER_ID,
      firstName: "Issue",
      lastName: "Author",
      username: "issueauthor",
      city: "Los Angeles",
      email: "author@civiclens.com",
      password: "securepassword123",
    });

    await User.create({
      id: STRANGER_USER_ID,
      firstName: "Random",
      lastName: "User",
      username: "randomuser",
      city: "Los Angeles",
      email: "stranger@civiclens.com",
      password: "securepassword123",
    });
  });

  beforeEach(async () => {
    // Re-seed the targeted issue before each test execution to ensure it exists fresh
    if (Issue) {
      await Issue.destroy({ where: { id: MOCK_ISSUE_ID }, force: true }).catch(
        () => null,
      );
      await Issue.create({
        id: MOCK_ISSUE_ID,
        title: "Pothole on 5th Ave",
        description: "Massive crater damaging wheels.",
        category: "Infrastructure",
        author_id: AUTHOR_USER_ID,
      });
    }
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should return 401 if the authentication token is completely missing", async () => {
    const response = await request(app).delete(`/api/issues/${MOCK_ISSUE_ID}`);
    expect(response.status).toBe(401);
  });

  it("should return 400 if the provided issue ID format is invalid", async () => {
    const response = await request(app)
      .delete("/api/issues/invalid-uuid-format")
      .set("Authorization", `Bearer ${authorToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid issue id");
  });

  it("should return 404 if the target issue does not exist", async () => {
    const missingUuid = "f0000000-0000-4000-8000-000000000000";
    const response = await request(app)
      .delete(`/api/issues/${missingUuid}`)
      .set("Authorization", `Bearer ${authorToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Issue not found");
  });

  it("should return 403 Star Guard error if a user attempts to delete someone else's issue", async () => {
    const response = await request(app)
      .delete(`/api/issues/${MOCK_ISSUE_ID}`)
      .set("Authorization", `Bearer ${strangerToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "You do not have permission to delete this issue.",
    );
  });

  it("should execute a professional soft delete, returning 204 while retaining data records", async () => {
    // 1. Fire delete request as the legitimate author
    const response = await request(app)
      .delete(`/api/issues/${MOCK_ISSUE_ID}`)
      .set("Authorization", `Bearer ${authorToken}`);

    expect(response.status).toBe(204);

    // 2. Standard queries should no longer see the issue
    const standardLookup = await Issue.findByPk(MOCK_ISSUE_ID);
    expect(standardLookup).toBeNull();

    // 3. Verification: Paranoid bypass query should prove data is preserved in history log
    const softDeletedLookup = await Issue.findByPk(MOCK_ISSUE_ID, {
      paranoid: false,
    });
    expect(softDeletedLookup).not.toBeNull();
    expect(softDeletedLookup.id).toBe(MOCK_ISSUE_ID);
    expect(softDeletedLookup.deletedAt).not.toBeNull(); // Verifies timestamps are tracked
  });
});
