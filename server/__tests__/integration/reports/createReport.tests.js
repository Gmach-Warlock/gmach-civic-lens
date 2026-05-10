const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");

describe("POST /api/reports", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  it("should return 201 and the created report object", async () => {
    const newReport = {
      userId: "123e4567-e89b-12d3-a456-426614174000",
      issueId: null,
      description: "Large pothole on Sunset Blvd",
      lat: 34.0928,
      lng: -118.3287,
      locationName: "Hollywood",
      severity: "low",
    };

    const response = await request(app).post("/api/reports").send(newReport);
    // ADD THIS LOG:
    if (response.status === 400) {
      console.log("SERVER SAYS:", response.body);
    }
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.description).toBe(newReport.description);
  });

  it("should return 400 if required fields are missing", async () => {
    const incompleteReport = {};

    const response = await request(app)
      .post("/api/reports")
      .send(incompleteReport);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 if userId is not a valid UUID", async () => {
    const badReport = {
      userId: "not-a-uuid",
      description: "Testing invalid userId", // Double check if this is 'description' or 'descriptions'
      lat: 34.0551,
      lng: -118.2425,
    };

    const response = await request(app).post("/api/reports").send(badReport); // Ensure no second argument is passed here

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return the correct report data in the response body", async () => {
    const reportData = {
      userId: "123e4567-e89b-12d3-a456-426614174000",
      description: "Deep object matching test",
      lat: 34.0522,
      lng: -118.2437,
      locationName: "Los Angeles",
      severity: "low",
    };
    const response = await request(app).post("/api/reports").send(reportData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(reportData);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("status", "open");
  });

  it("should return 400 if latitude is out of range (-90 to 90)", async () => {
    const outOfBoundsReport = {
      userId: "123e4567-e89b-12d3-a456-426614174000",
      description: "Pothole in space",
      lat: 150.0,
      lng: -118.2437,
      severity: "low",
    };

    const response = await request(app)
      .post("/api/reports")
      .send(outOfBoundsReport);

    expect(response.status).toBe(400);
  });
});

describe("POST /api/reports - Advanced STAR Guards", () => {
  // --- TYPE TESTING GROUP ---
  describe("Type Validation (T)", () => {
    it("should return 400 if userId is a boolean", async () => {
      const response = await request(app).post("/api/reports").send({
        userId: true, // Boolean instead of UUID string
        description: "Testing boolean type guard",
        lat: 34.0522,
        lng: -118.2437,
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toContain("UUID");
    });

    it("should return 400 if coordinates are passed as arrays", async () => {
      const response = await request(app)
        .post("/api/reports")
        .send({
          userId: "123e4567-e89b-12d3-a456-426614174000",
          description: "Array coordinates test",
          lat: [34.0522], // Array instead of Number
          lng: -118.2437,
        });
      expect(response.status).toBe(400);
      expect(response.body.error).toContain("must be valid numbers");
    });
  });

  // --- BOUNDARY / RANGE TESTING GROUP ---
  describe("Boundary Precision (S & R)", () => {
    it("should allow coordinates exactly on the boundary edge (-90, -180)", async () => {
      const boundaryReport = {
        userId: "123e4567-e89b-12d3-a456-426614174000",
        description: "Exact south-west boundary corner of the map",
        lat: -90.0,
        lng: -180.0,
        severity: "low",
      };
      const response = await request(app)
        .post("/api/reports")
        .send(boundaryReport);
      expect(response.status).toBe(201);
    });

    it("should reject latitude marginally out of bounds (-90.0001)", async () => {
      const outOfBounds = {
        userId: "123e4567-e89b-12d3-a456-426614174000",
        description: "Marginally out of bounds",
        lat: -90.0001,
        lng: -118.2437,
        severity: "low",
      };
      const response = await request(app)
        .post("/api/reports")
        .send(outOfBounds);
      expect(response.status).toBe(400);
    });
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
