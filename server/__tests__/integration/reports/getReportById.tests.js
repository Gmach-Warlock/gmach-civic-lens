const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const jwt = require("jsonwebtoken");

describe("GET /api/reports/:id (getReportById)", () => {
  let adminToken;
  let adminUser;
  let tempReport;
  const validUuid = "123e4567-e89b-12d3-a456-426614174000";
  const nonExistentUuid = "223e4567-e89b-12d3-a456-426614174000";

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // Ensure the admin user exists in the db
    adminUser = await db.User.create({
      id: "f0680d78-798b-41f1-820e-804310f75b11",
      firstName: "Admin",
      lastName: "User",
      username: "adminuser",
      email: "admin@example.com",
      password: "hashedpassword123",
      address: "123 Admin Way",
      city: "Los Angeles",
      zipCode: "90001",
      isAdmin: true,
    });

    adminToken = jwt.sign(
      { id: adminUser.id, isAdmin: true },
      process.env.JWT_SECRET || "YOUR_JWT_SECRET",
      { expiresIn: "1h" },
    );

    // Create a temporary report to query
    tempReport = await db.Report.create({
      id: validUuid,
      userId: adminUser.id,
      description: "Existing report test",
      lat: 34.0522,
      lng: -118.2437,
      severity: "medium",
    });
  });

  it("should return 400 and a message if the ID is not a valid UUID format", async () => {
    const response = await request(app)
      .get("/api/reports/not-a-valid-uuid")
      .set("Authorization", `Bearer ${adminToken}`); // Set token

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid report id");
  });

  it("should return 404 if the report does not exist in the database", async () => {
    const response = await request(app)
      .get(`/api/reports/${nonExistentUuid}`)
      .set("Authorization", `Bearer ${adminToken}`); // Set token

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Report not found");
  });

  it("should return 500 if an unexpected database error occurs", async () => {
    const findByPkSpy = jest
      .spyOn(db.Report, "findByPk")
      .mockRejectedValue(new Error("Database crash!"));

    const response = await request(app)
      .get(`/api/reports/${validUuid}`)
      .set("Authorization", `Bearer ${adminToken}`); // Set token

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");

    findByPkSpy.mockRestore();
  });

  it("should successfully retrieve the report and return a 200 status", async () => {
    const response = await request(app)
      .get(`/api/reports/${tempReport.id}`)
      .set("Authorization", `Bearer ${adminToken}`); // Set token

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("report");
    expect(response.body.report.id).toBe(tempReport.id);
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
