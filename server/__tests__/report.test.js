const request = require("supertest");
const app = require("../src/app");
const db = require("../src/models");

describe("POST /api/reports/create", () => {
  // Before each test, we might want to clear the DB or sync it
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  it("should return 201 and the created report object", async () => {
    const newReport = {
      description: "Large pothole on Sunset Blvd",
      lat: 34.0928,
      lng: -118.3287,
      location_name: "Hollywood",
      severity: 4,
    };

    const response = await request(app).post("/api/reports").send(newReport);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.description).toBe(newReport.description);
  });
});

afterAll(async () => {
  await db.sequelize.close(); // Close the "Engine"
});
