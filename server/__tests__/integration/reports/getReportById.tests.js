const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { Report, User } = db;

// 1. NO "async" here! Keep the describe block completely synchronous.
describe("GET /api/reports/:id (getReportById)", () => {
  let tempReport;
  let tempUser;

  // 2. YES "async" here! Because we use "await" inside beforeAll.
  beforeAll(async () => {
    // Sync database
    await db.sequelize.sync({ force: false });

    // Create a mock User if your database schema requires a real record for the foreign key
    if (User) {
      tempUser = await User.create({
        id: "b0000000-0000-4000-8000-000000000000",
        email: "testuser@civiclens.com",
        password: "securepassword123",
      }).catch(() => null); // Catch if it already exists
    }

    // Seed the temporary report with the required userId
    tempReport = await Report.create({
      id: "c0000000-0000-4000-8000-000000000000",
      title: "Sample Incident Report",
      description: "A detailed description of the reported issue.",
      status: "pending",
      userId: tempUser ? tempUser.id : "b0000000-0000-4000-8000-000000000000",
    });
  });

  // 3. YES "async" here! Because we use "await" inside afterAll.
  afterAll(async () => {
    // Clean up in reverse order to respect foreign key constraints
    if (tempReport) {
      await Report.destroy({ where: { id: tempReport.id } });
    }
    if (tempUser) {
      await User.destroy({ where: { id: tempUser.id } });
    }
    await db.sequelize.close();
  });

  // --- Rail 1: The Validation Check (Expected: 400 Bad Request) ---
  it("should return 400 and a message if the ID is not a valid UUID format", async () => {
    const response = await request(app).get("/api/reports/not-a-valid-uuid");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid report id");
  });

  // --- Rail 2: The Not Found Check (Expected: 404 Not Found) ---
  it("should return 404 if the report does not exist in the database", async () => {
    const nonExistentUuid = "a0000000-0000-4000-8000-000000000000";
    const response = await request(app).get(`/api/reports/${nonExistentUuid}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Report not found");
  });

  // --- Rail 3: The Disaster Check (Expected: 500 Server Error) ---
  it("should return 500 if an unexpected database error occurs", async () => {
    const findByPkSpy = jest
      .spyOn(Report, "findByPk")
      .mockRejectedValueOnce(new Error("Database connection timed out"));

    const validUuid = "12345678-1234-4234-8234-123456789012";
    const response = await request(app).get(`/api/reports/${validUuid}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");

    findByPkSpy.mockRestore();
  });

  // --- Rail 4: The Happy Path (Expected: 200 Success) ---
  it("should successfully retrieve the report and return a 200 status", async () => {
    const response = await request(app).get(`/api/reports/${tempReport.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("report");
    expect(response.body.report.id).toBe(tempReport.id);
  });
});
