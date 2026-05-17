const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User, Report } = db;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const ADMIN_ID = "a0000000-0000-4000-8000-000000000000";
const MOCK_REPORT_ID = "f0000000-0000-4000-8000-000000000000";

describe("PUT /api/reports/:id (updateReport)", () => {
  let adminToken;

  beforeAll(async () => {
    await db.sequelize.sync({ force: false });
    adminToken = jwt.sign({ id: ADMIN_ID, role: "admin" }, JWT_SECRET);

    await User.destroy({ where: { id: ADMIN_ID }, force: true }).catch(
      () => null,
    );
    await User.destroy({ where: { username: "adminuser" }, force: true }).catch(
      () => null,
    );
    await User.create({
      id: ADMIN_ID,
      firstName: "System",
      lastName: "Admin",
      username: "adminuser",
      email: "admin@test.com",
      password: "password123!",
      city: "Los Angeles",
      isAdmin: true,
    });
  });

  beforeEach(async () => {
    await Report.destroy({
      where: { id: MOCK_REPORT_ID },
      force: true,
    });

    await Report.create({
      id: MOCK_REPORT_ID,
      userId: ADMIN_ID,
      description: "Original report description",
      lat: 34.05,
      lng: -118.24,
      status: "open",
      severity: "medium",
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should successfully update report fields and return 200", async () => {
    const response = await request(app)
      .put(`/api/reports/${MOCK_REPORT_ID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "closed",
        severity: "high",
        description: "Updated description after review.",
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("closed");
    expect(response.body.severity).toBe("high");
  });

  it("should return 400 if the report ID is not a valid UUID", async () => {
    const response = await request(app)
      .put("/api/reports/not-a-uuid")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "closed" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid report id");
  });

  // --- VALIDATION: TYPE CHECKS ---
  it("should return 400 if lat or lng are provided as invalid types (strings)", async () => {
    const response = await request(app)
      .put(`/api/reports/${MOCK_REPORT_ID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ lat: "not-a-number", lng: -118.24 });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "Latitude and Longitude must be valid numbers",
    );
  });

  // --- VALIDATION: PLANETARY BOUNDARIES ---
  it("should return 400 if coordinates are out of bounds", async () => {
    const response = await request(app)
      .put(`/api/reports/${MOCK_REPORT_ID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ lat: 150.0, lng: -118.24 }); // Lat > 90

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Latitude must be between -90 and 90.");
  });

  // --- VALIDATION: XSS/HTML GUARD ---
  it("should return 400 if description contains HTML tags", async () => {
    const response = await request(app)
      .put(`/api/reports/${MOCK_REPORT_ID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ description: "<script>alert('xss')</script>" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No code is allowed in input fields!");
  });

  // --- NOT FOUND CASE ---
  it("should return 404 when updating a non-existent report", async () => {
    const fakeId = "00000000-0000-4000-8000-000000000000";
    const response = await request(app)
      .put(`/api/reports/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "closed" });

    expect(response.status).toBe(404);
  });

  it("should return 400 if an invalid severity level is provided", async () => {
    const response = await request(app)
      .put(`/api/reports/${MOCK_REPORT_ID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ severity: "critical" }); // Not in our ENUM (low, medium, high)

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Invalid severity level. Must be low, medium, or high.",
    );
  });

  // --- INTERNAL ERROR SIMULATION ---
  it("should return 500 if a database error occurs during update", async () => {
    // Spy on the model's findByPk and force it to throw an error
    const spy = jest.spyOn(Report, "findByPk").mockImplementation(() => {
      throw new Error("Database connection lost");
    });

    const response = await request(app)
      .put(`/api/reports/${MOCK_REPORT_ID}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "closed" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Database connection lost");

    spy.mockRestore();
  });
});
