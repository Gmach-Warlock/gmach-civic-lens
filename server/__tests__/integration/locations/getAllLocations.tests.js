require("dotenv").config();
const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const location = db.Location;
const jwt = require("jsonwebtoken");

const { User, Location, Issue } = db;
const JWT_SECRET = process.env.JWT_SECRET;

describe("GET all locations", () => {
  let validToken;
  let tempUser;
  let tempLocation;
  let tempIssue;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    validToken = jwt.sign(
      { id: "f0680d78-798b-41f1-820e-804310f75b11", email: "test@example.com" },
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
        isAdmin: false,
      });
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

  it("should exist", async () => {
    try {
      // Attach the token in the Authorization header
      const response = await request(app)
        .get("/api/locations/")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("locations");
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  });

  it("should return a 401 if a valid accessToken isn't provided", async () => {
    const response = await request(app).get("/api/locations/");
    expect(response.status).toBe(401);
  });

  it("should return 500 if an unexpected error occurs", async () => {
    const findAllSpy = jest
      .spyOn(Location, "findAll")
      .mockRejectedValueOnce(new Error("Database connection timed out"));

    const response = await request(app)
      .get("/api/locations/")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");

    findAllSpy.mockRestore();
  });

  it("should retrieve all of the locations, and send back a 200 status if the accessToken is present and valid", async () => {
    const response = await request(app)
      .get("/api/locations/")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
  });
});
