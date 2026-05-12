require("dotenv").config();
const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const jwt = require("jsonwebtoken");

const { Report, User, Location, Issue } = db;
const JWT_SECRET = process.env.JWT_SECRET || "YOUR_JWT_SECRET";

describe("getAllReports Route", () => {
  let validTestToken;
  let tempUser;
  let tempLocation;
  let tempIssue;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    validTestToken = jwt.sign(
      {
        id: "b0000000-0000-4000-8000-000000000000",
        email: "testuser@civiclens.com",
        isAdmin: true,
      },
      JWT_SECRET,
    );

    if (User) {
      tempUser = await User.create({
        id: "b0000000-0000-4000-8000-000000000000",
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        email: "testuser@civiclens.com",
        password: "securePassword123",
        city: "Los Angeles",
        isAdmin: true,
      });
    }

    if (Location) {
      tempLocation = await Location.create({
        id: "d0000000-0000-4000-8000-000000000000",
        lat: 34.0522,
        lng: -118.2437,
      }).catch(() => null);
    }

    if (Issue && tempUser) {
      tempIssue = await Issue.create({
        id: "e0000000-0000-4000-8000-000000000000",
        title: "Pothole on Main St",
        description: "Massive pothole damaging cars.",
        category: "infrastructure",
        author_id: tempUser.id,
      }).catch(() => null);
    }
  });

  afterAll(async () => {
    if (tempIssue) {
      await Issue.destroy({ where: { id: tempIssue.id } }).catch(() => null);
    }
    if (tempLocation) {
      await Location.destroy({ where: { id: tempLocation.id } }).catch(
        () => null,
      );
    }
    if (tempUser) {
      await User.destroy({ where: { id: tempUser.id } }).catch(() => null);
    }
    await db.sequelize.close();
  });

  // --- Tests ---

  it("should return 401 if a valid accessToken is not provided", async () => {
    const response = await request(app).get("/api/reports");
    expect(response.status).toBe(401);
  });

  it("should return 500 if an unexpected database error occurs", async () => {
    const findAllSpy = jest
      .spyOn(Report, "findAll")
      .mockRejectedValueOnce(new Error("Database connection timed out"));

    const response = await request(app)
      .get("/api/reports")
      .set("Authorization", `Bearer ${validTestToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");

    findAllSpy.mockRestore();
  });

  it("should retrieve all of the issues, and send back a 200 status if the tokens are present and valid.", async () => {
    const response = await request(app)
      .get("/api/reports")
      .set("Authorization", `Bearer ${validTestToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reports");
    expect(Array.isArray(response.body.reports)).toBe(true);
  });
});
