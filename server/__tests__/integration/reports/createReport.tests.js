const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const jwt = require("jsonwebtoken");

describe("POST /api/reports", () => {
  let adminToken;
  let adminUser;

  beforeAll(async () => {
    // Sync the database and wipe clean
    await db.sequelize.sync({ force: true });

    // Seed the Admin User into the database
    adminUser = await db.User.create({
      id: "f0680d78-798b-41f1-820e-804310f75b11", // Valid UUID format
      firstName: "Admin",
      lastName: "User",
      username: "adminuser",
      email: "admin@example.com",
      password: "hashedpassword123",
      address: "123 Admin Way",
      city: "Los Angeles",
      zipCode: "90001",
      isAdmin: true, // Must be true for requireAdmin middleware
    });

    // Sign the token with the correct user ID
    adminToken = jwt.sign(
      { id: adminUser.id, isAdmin: true },
      process.env.JWT_SECRET || "YOUR_JWT_SECRET",
      { expiresIn: "1h" },
    );
  });

  it("should return 401/403 if no authorization token is provided", async () => {
    const newReport = {
      userId: "123e4567-e89b-12d3-a456-426614174000",
      description: "Unauthenticated report attempt",
      lat: 34.0928,
      lng: -118.3287,
    };

    const response = await request(app).post("/api/reports").send(newReport);

    expect([401, 403]).toContain(response.status);
  });

  it("should return 400 if required fields are missing", async () => {
    const incompleteReport = {};

    const response = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(incompleteReport);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 if userId is not a valid UUID", async () => {
    const badReport = {
      userId: "not-a-uuid",
      description: "Testing invalid userId",
      lat: 34.0551,
      lng: -118.2425,
    };

    const response = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(badReport);

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

    const response = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(reportData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(reportData);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("createdAt");
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
      .set("Authorization", `Bearer ${adminToken}`)
      .send(outOfBoundsReport);

    expect(response.status).toBe(400);
  });

  it("should return 201 and the created report object when authorized as Admin", async () => {
    const newReport = {
      userId: "123e4567-e89b-12d3-a456-426614174000",
      description: "Large pothole on Sunset Blvd",
      lat: 34.0928,
      lng: -118.3287,
      locationName: "Hollywood",
      severity: "low",
    };

    const response = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newReport);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.description).toBe(newReport.description);
  });
});

describe("POST /api/reports - Advanced STAR Guards", () => {
  let adminToken;

  beforeAll(async () => {
    // We recreate the same Admin user just in case sync force was triggered differently
    await db.User.findOrCreate({
      where: { id: "f0680d78-798b-41f1-820e-804310f75b11" },
      defaults: {
        firstName: "Admin",
        lastName: "User",
        username: "adminuser",
        email: "admin@example.com",
        password: "hashedpassword123",
        address: "123 Admin Way",
        city: "Los Angeles",
        zipCode: "90001",
        isAdmin: true,
      },
    });

    adminToken = jwt.sign(
      { id: "f0680d78-798b-41f1-820e-804310f75b11", isAdmin: true },
      process.env.JWT_SECRET || "YOUR_JWT_SECRET",
    );
  });

  describe("Type Validation (T)", () => {
    it("should return 400 if userId is a boolean", async () => {
      const response = await request(app)
        .post("/api/reports")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          userId: true,
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
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          userId: "123e4567-e89b-12d3-a456-426614174000",
          description: "Array coordinates test",
          lat: [34.0522],
          lng: -118.2437,
        });
      expect(response.status).toBe(400);
      expect(response.body.error).toContain("must be valid numbers");
    });
  });

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
        .set("Authorization", `Bearer ${adminToken}`)
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
        .set("Authorization", `Bearer ${adminToken}`)
        .send(outOfBounds);
      expect(response.status).toBe(400);
    });
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
