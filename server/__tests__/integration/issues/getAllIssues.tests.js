require("dotenv").config();
const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const jwt = require("jsonwebtoken");
const { Issue, User, Location } = db;

const JWT_SECRET = process.env.JWT_SECRET;

describe("getAllIssues Route", () => {
  let tempUser;
  let tempLocation;
  let tempIssue;
  let validTestToken;

  beforeAll(async () => {
    // Sync database
    await db.sequelize.sync({ force: false });
    validTestToken = jwt.sign(
      {
        id: "b0000000-0000-4000-8000-000000000000",
        email: "testuser@civiclens.com",
      },
      JWT_SECRET,
    );
    // Seed dummy user
    if (User) {
      tempUser = await User.create({
        id: "b0000000-0000-4000-8000-000000000000",
        email: "issue_finder@civiclens.com",
        password: "securepassword123",
      }).catch(() => null);
    }

    // Seed dummy location
    if (Location) {
      tempLocation = await Location.create({
        id: "d0000000-0000-4000-8000-000000000000",
        lat: 34.0522,
        lng: -118.2437,
      }).catch(() => null);
    }

    // Seed dummy issue
    if (Issue) {
      tempIssue = await Issue.create({
        id: "e0000000-0000-4000-8000-000000000000",
        title: "Pothole on Main St",
        description: "Massive pothole damaging cars.",
        category: "infrastructure",
        author_id: tempUser ? tempUser.id : null,
      }).catch(() => null);
    }
  });

  afterAll(async () => {
    if (tempIssue) await Issue.destroy({ where: { id: tempIssue.id } });
    if (tempLocation)
      await Location.destroy({ where: { id: tempLocation.id } });
    if (tempUser) await User.destroy({ where: { id: tempUser.id } });
    await db.sequelize.close();
  });

  it("should return 401 if a valid accessToken is not provided", async () => {
    const response = await request(app).get("/api/issues");
    expect(response.status).toBe(401);
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

  it("should retrieve all of the issues, and send back a 200 status if the tokens are present and valid.", async () => {
    const response = await request(app)
      .get("/api/issues")
      .set("Authorization", `Bearer ${validTestToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("issues");
    expect(Array.isArray(response.body.issues)).toBe(true);
  });
});
