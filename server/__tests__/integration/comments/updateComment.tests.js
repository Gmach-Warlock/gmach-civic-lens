const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User, Issue, Comment } = db;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const AUTHOR_USER_ID = "b0000000-0000-4000-8000-000000000001";
const STRANGER_USER_ID = "b0000000-0000-4000-8000-000000000002";
const MOCK_ISSUE_ID = "c0000000-0000-4000-8000-000000000000";
const MOCK_COMMENT_ID = "d0000000-0000-4000-8000-000000000000";

describe("PUT /api/comments/:id (updateComment)", () => {
  let authorToken;
  let strangerToken;

  beforeAll(async () => {
    await db.sequelize.sync({ force: false });

    // Isolate test sandbox state
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

    authorToken = jwt.sign(
      { id: AUTHOR_USER_ID, email: "commenter@civiclens.com" },
      JWT_SECRET,
    );
    strangerToken = jwt.sign(
      { id: STRANGER_USER_ID, email: "stranger@civiclens.com" },
      JWT_SECRET,
    );

    // Seed Users
    await User.create({
      id: AUTHOR_USER_ID,
      firstName: "Comment",
      lastName: "Author",
      username: "commentauthor",
      city: "Los Angeles",
      email: "commenter@civiclens.com",
      password: "securepassword123",
    });

    await User.create({
      id: STRANGER_USER_ID,
      firstName: "Random",
      lastName: "User",
      username: "randomcommenter",
      city: "Los Angeles",
      email: "stranger@civiclens.com",
      password: "securepassword123",
    });

    // Seed Parent Issue
    await Issue.create({
      id: MOCK_ISSUE_ID,
      title: "Pothole on 5th Ave",
      description: "Massive crater damaging wheels.",
      category: "Infrastructure",
      author_id: AUTHOR_USER_ID,
    });
  });

  beforeEach(async () => {
    // Fresh comment state before each test
    if (Comment) {
      await Comment.destroy({
        where: { id: MOCK_COMMENT_ID },
        force: true,
      }).catch(() => null);
      await Comment.create({
        id: MOCK_COMMENT_ID,
        content: "This is the original comment content.",
        issue_id: MOCK_ISSUE_ID,
        author_id: AUTHOR_USER_ID,
      });
    }
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should return 401 if the authentication token is completely missing", async () => {
    const response = await request(app)
      .put(`/api/comments/${MOCK_COMMENT_ID}`)
      .send({ content: "Sneaky update attempt" });

    expect(response.status).toBe(401);
  });

  it("should return 400 if the provided comment ID format is invalid", async () => {
    const response = await request(app)
      .put("/api/comments/invalid-uuid-format")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "Valid text body" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid comment id");
  });

  it("should return 400 if the content field is empty or missing", async () => {
    const response = await request(app)
      .put(`/api/comments/${MOCK_COMMENT_ID}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Content is required and cannot be empty.",
    );
  });

  it("should return 404 if the target comment does not exist", async () => {
    const missingUuid = "f0000000-0000-4000-8000-000000000000";
    const response = await request(app)
      .put(`/api/comments/${missingUuid}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "Updated text body" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Comment not found");
  });

  it("should return 403 Star Guard error if a user tries to modify someone else's comment", async () => {
    const response = await request(app)
      .put(`/api/comments/${MOCK_COMMENT_ID}`)
      .set("Authorization", `Bearer ${strangerToken}`)
      .send({ content: "Malicious update attempt" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "You do not have permission to edit this comment.",
    );
  });

  it("should successfully update the comment and return 200 with the updated entity", async () => {
    const response = await request(app)
      .put(`/api/comments/${MOCK_COMMENT_ID}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "This comment has been successfully modified!" });

    expect(response.status).toBe(200);
    expect(response.body.content).toBe(
      "This comment has been successfully modified!",
    );

    // Double check the database sandbox
    const updatedRecord = await Comment.findByPk(MOCK_COMMENT_ID);
    expect(updatedRecord.content).toBe(
      "This comment has been successfully modified!",
    );
  });
});
