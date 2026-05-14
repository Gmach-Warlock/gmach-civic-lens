const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User, Issue, Location } = db;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const TEST_USER_ID = "b0000000-0000-4000-8000-000000000001";
const MOCK_ISSUE_ID = "c0000000-0000-4000-8000-000000000000";
const MOCK_LOCATION_ID = "e0000000-0000-4000-8000-000000000000";

describe("DELETE /api/locations/:id (deleteLocation)", () => {
  let validToken;

  beforeAll(async () => {
    await db.sequelize.sync({ force: false });

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

    await User.create({
      id: TEST_USER_ID,
      firstName: "City",
      lastName: "Worker",
      username: "cityworker",
      city: "Los Angeles",
      email: "cityworker@civiclens.com",
      password: "securepassword123",
    });

    await Issue.create({
      id: MOCK_ISSUE_ID,
      title: "Broken Streetlight",
      description: "Light pole knocked down on Elm St.",
      category: "Utilities",
      author_id: TEST_USER_ID,
    });
  });

  beforeEach(async () => {
    if (Location) {
      await Location.destroy({
        where: { id: MOCK_LOCATION_ID },
        force: true,
      }).catch(() => null);
      await Location.create({
        id: MOCK_LOCATION_ID,
        lat: 34.0522,
        lng: -118.2437,
        locationName: "Elm St Spot for Removal",
        issue_id: MOCK_ISSUE_ID,
      });
    }
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should return 401 if the authentication token is completely missing", async () => {
    const response = await request(app).delete(
      `/api/locations/${MOCK_LOCATION_ID}`,
    );
    expect(response.status).toBe(401);
  });

  it("should return 400 if the provided location ID format is invalid", async () => {
    const response = await request(app)
      .delete("/api/locations/invalid-uuid-format")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid location id");
  });

  it("should return 404 if the target location record does not exist", async () => {
    const missingUuid = "f0000000-0000-4000-8000-000000000000";
    const response = await request(app)
      .delete(`/api/locations/${missingUuid}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Location record not found");
  });

  it("should successfully remove the location record and return 204", async () => {
    const response = await request(app)
      .delete(`/api/locations/${MOCK_LOCATION_ID}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(204);

    const lookUp = await Location.findByPk(MOCK_LOCATION_ID);
    expect(lookUp).toBeNull();
  });
});
