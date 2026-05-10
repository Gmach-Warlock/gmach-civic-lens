const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { Report } = db;

describe("GET /api/reports/:id (getReportById)", () => {
  let tempReport;

  // We set up our test data once before the tests run
  beforeAll(async () => {
    await db.sequelize.sync({ force: false });

    // Seed a temporary report for our Happy Path (Rail 4)
    tempReport = await Report.create({
      title: "Sample Incident Report",
      description: "A detailed description of the reported issue.",
      status: "pending",
      // Add any other non-nullable fields your Report model requires
    });
  });

  // Clean up after ourselves
  afterAll(async () => {
    if (tempReport) {
      await Report.destroy({ where: { id: tempReport.id } });
    }
    await db.sequelize.close();
  });

  // --- Rail 1: The Validation Check (Expected: 400 Bad Request) ---
  it("should return 400 and a message if the ID is not a valid UUID format", async () => {
    // Instead of sending a body, we test sending an invalid ID parameter in the URL
    const response = await request(app).get("/api/reports/not-a-valid-uuid");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid report id");
  });

  // --- Rail 2: The Not Found Check (Expected: 404 Not Found) ---
  it("should return 404 if the report does not exist in the database", async () => {
    // Send a validly formatted UUID that simply won't exist in our DB
    const nonExistentUuid = "a0000000-0000-4000-8000-000000000000";

    const response = await request(app).get(`/api/reports/${nonExistentUuid}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Report not found");
  });

  // --- Rail 3: The Disaster Check (Expected: 500 Server Error) ---
  it("should return 500 if an unexpected database error occurs", async () => {
    // Spy on Report.findByPk to force it to fail
    const findByPkSpy = jest
      .spyOn(Report, "findByPk")
      .mockRejectedValueOnce(new Error("Database connection timed out"));

    const validUuid = "12345678-1234-4234-8234-123456789012";
    const response = await request(app).get(`/api/reports/${validUuid}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");

    // Clean up our spy
    findByPkSpy.mockRestore();
  });

  // --- Rail 4: The Happy Path (Expected: 200 Success) ---
  it("should successfully retrieve the report and return a 200 status", async () => {
    // We query using the tempReport we set up in the beforeAll hook!
    const response = await request(app).get(`/api/reports/${tempReport.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("report");
    expect(response.body.report.id).toBe(tempReport.id);
  });
});
