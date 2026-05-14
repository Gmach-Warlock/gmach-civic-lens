const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User, Report } = db;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const ADMIN_ID = "a0000000-0000-4000-8000-000000000000";
const MOCK_REPORT_ID = "f0000000-0000-4000-8000-000000000000";

describe("Admin Reports CRUD (Update/Delete)", () => {
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
    await Report.destroy({ where: {}, force: true });
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

  it("should return a 400 status if the id is invalid", async () => {
    const response = await request(app)
      .delete("/api/reports/invalid-uuid") // Ensure this is a string
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid report id");
  });

  it("should allow an admin to delete a report", async () => {
    const response = await request(app)
      .delete(`/api/reports/${MOCK_REPORT_ID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(204);

    const check = await Report.findByPk(MOCK_REPORT_ID);
    expect(check).toBeNull();
  });

  it("should perform a soft delete (record remains in DB but hidden from standard queries)", async () => {
    // 1. Act: Delete the report
    const response = await request(app)
      .delete(`/api/reports/${MOCK_REPORT_ID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(204);

    // 2. Verification A: Standard lookup should return null
    const standardLookup = await Report.findByPk(MOCK_REPORT_ID);
    expect(standardLookup).toBeNull();

    // 3. Verification B: Paranoid: false lookup should still find it
    const rawLookup = await Report.findByPk(MOCK_REPORT_ID, {
      paranoid: false,
    });
    expect(rawLookup).not.toBeNull();
    expect(rawLookup.id).toBe(MOCK_REPORT_ID);
    expect(rawLookup.deletedAt).not.toBeNull(); // Ensure the timestamp is set
  });

  it("should return 404 if the report is already soft-deleted", async () => {
    // Delete it first
    await Report.destroy({ where: { id: MOCK_REPORT_ID } });

    // Try to delete it again via API
    const response = await request(app)
      .delete(`/api/reports/${MOCK_REPORT_ID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Report not found");
  });
});
