const request = require("supertest");
const express = require("express");
const db = require("../../../src/models");
const issuesRouter = require("../../../src/routes/issuesRoutes");

// Mocking auth middleware to simulate 'John' being logged in safely
jest.mock("../../../src/middleware/auth", () => ({
  requireUser: (req, res, next) => {
    req.user = {
      id: "11111111-1111-1111-1111-111111111111",
      username: "john_doe",
    };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/api/issues", issuesRouter);

describe("PATCH /api/issues/:id/upvote", () => {
  let testIssue;

  beforeAll(async () => {
    // Sync database tables cleanly before executing tests
    await db.sequelize.sync({ force: true });

    // 1. Create a dummy user with required structural database properties
    const user = await db.User.create({
      id: "11111111-1111-1111-1111-111111111111",
      username: "john_doe",
      firstName: "John",
      lastName: "Doe",
      email: "john@lens.com",
      password: "hashed_secure_password",
      city: "Los Angeles", // <-- Added to pass validation constraints
      zipCode: "90001", // <-- Added (Use whatever exact casing your User model expects: zipCode or zip_code)
    });

    // 2. Setup a test issue to run our upvote patches against
    testIssue = await db.Issue.create({
      title: "Crack in the Middle of the Street",
      description: "There is a big crack in the middle of the road.",
      category: "Roads",
      author_id: user.id,
      upvotes: 0,
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should successfully increment on first click, and decrement on second click (toggle guard)", async () => {
    // First click (Upvote)
    const firstClick = await request(app)
      .patch(`/api/issues/${testIssue.id}/upvote`)
      .send();
    expect(firstClick.status).toBe(200);
    expect(firstClick.body.issues[0].social.upvotes).toBe(1);

    // Second click from same user (Remove Upvote)
    const secondClick = await request(app)
      .patch(`/api/issues/${testIssue.id}/upvote`)
      .send();
    expect(secondClick.status).toBe(200);
    expect(secondClick.body.issues[0].social.upvotes).toBe(0); // Safely back to zero!
  });

  it("should return a 404 status error if the issue id does not exist", async () => {
    const fakeUuid = "99999999-9999-9999-9999-999999999999";
    const res = await request(app)
      .patch(`/api/issues/${fakeUuid}/upvote`)
      .send();

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Issue not found");
  });

  it("should return a 400 status error if an invalid UUID string format is passed", async () => {
    const res = await request(app)
      .patch("/api/issues/not-a-valid-uuid/upvote")
      .send();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Please provide a valid issue id",
    );
  });
});
