const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User, Issue, Location } = db;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const TEST_USER_ID = "b0000000-0000-4000-8000-000000000001";
const MOCK_ISSUE_ID = "c0000000-0000-4000-8000-000000000000";
const MOCK_LOCATION_ID = "e0000000-0000-4000-8000-000000000000";

describe("PUT /api/locations/:id (updateLocation)", () => {
  let validToken;

  beforeAll(async () => {
    await db.sequelize.sync({ force: false });

    // Truncate tables cleanly to avoid cross-file state contamination
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

    validToken = jwt.sign(
      { id: TEST_USER_ID, email: "cityworker@civiclens.com" },
      JWT_SECRET,
    );

    // Seed User
    await User.create({
      id: TEST_USER_ID,
      firstName: "City",
      lastName: "Worker",
      username: "cityworker",
      city: "Los Angeles",
      email: "cityworker@civiclens.com",
      password: "securepassword123",
    });

    // Seed Parent Issue
    await Issue.create({
      id: MOCK_ISSUE_ID,
      title: "Broken Streetlight",
      description: "Light pole knocked down on Elm St.",
      category: "Utilities",
      author_id: TEST_USER_ID,
    });
  });

  beforeEach(async () => {
    // Re-seed location record fresh before each test run
    if (Location) {
      await Location.destroy({
        where: { id: MOCK_LOCATION_ID },
        force: true,
      }).catch(() => null);
      await Location.create({
        id: MOCK_LOCATION_ID,
        lat: 34.0522,
        lng: -118.2437,
        locationName: "Initial Elm St Spot",
        issue_id: MOCK_ISSUE_ID,
      });
    }
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should return 401 if the authentication token is completely missing", async () => {
    const response = await request(app)
      .put(`/api/locations/${MOCK_LOCATION_ID}`)
      .send({ lat: 34.06, lng: -118.25 });

    expect(response.status).toBe(401);
  });

  it("should return 400 if the provided location ID format is invalid", async () => {
    const response = await request(app)
      .put("/api/locations/invalid-uuid-format")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ lat: 34.06, lng: -118.25 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid location id");
  });

  it("should return 400 if lat or lng fields are completely missing", async () => {
    const response = await request(app)
      .put(`/api/locations/${MOCK_LOCATION_ID}`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ locationName: "Missing coordinates" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Latitude and longitude are required fields.",
    );
  });

  it("should return 400 if coordinates exceed planetary boundaries (lat outside -90 to 90)", async () => {
    const response = await request(app)
      .put(`/api/locations/${MOCK_LOCATION_ID}`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ lat: 95.5, lng: -118.25 }); // Out of bounds!

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Coordinates are out of acceptable geographic boundaries.",
    );
  });

  it("should return 404 if the targeted location record does not exist", async () => {
    const missingUuid = "f0000000-0000-4000-8000-000000000000";
    const response = await request(app)
      .put(`/api/locations/${missingUuid}`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ lat: 34.06, lng: -118.25 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Location record not found");
  });

  it("should successfully update coordinates and return 200 with the modified record", async () => {
    const response = await request(app)
      .put(`/api/locations/${MOCK_LOCATION_ID}`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        lat: 34.0592,
        lng: -118.2411,
        locationName: "Adjusted Elm St Corner",
      });

    expect(response.status).toBe(200);
    // Convert to numbers since decimals might come back as strings from Postgres
    expect(Number(response.body.lat)).toBe(34.0592);
    expect(Number(response.body.lng)).toBe(-118.2411);
    expect(response.body.locationName).toBe("Adjusted Elm St Corner");
  });
});
