const request = require("supertest");
const db = require("../../../src/models");
const Issue = db.Issue;
const app = require("../../../src/app");

describe("Issue Model TDD = Database Integration", () => {
  beforeEach(async () => {
    try {
      // Use the string "RAW" to avoid the undefined QueryTypes error
      await db.sequelize.query(
        "TRUNCATE TABLE issues RESTART IDENTITY CASCADE",
        { type: "RAW" },
      );
    } catch (error) {
      console.error("Cleanup Error:", error.message);
      throw error;
    }
  });

  // Test 1: Guard Layer 1 (Existence)
  it("should return 400 if any required field is missing", async () => {
    const response = await request(app)
      .post("/api/issues")
      .send({ title: "Broken Light" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "All fields (title, description, category) are required.",
    );
  });

  // Test 2: Title Size
  it("should return 400 if title is too short", async () => {
    const response = await request(app).post("/api/issues").send({
      title: "Hi",
      description: "Valid description here...",
      category: "UI",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "Title must be at least 5 characters",
    );
  });

  test("should throw a database/validation error if required inputs are missing", async () => {
    const invalidData = {
      description: "The neon lights are flickering too fast.",
      category: "UI",
    };

    let error;
    try {
      await Issue.create(invalidData);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("SequelizeValidationError");
  });

  // --- TEST 3: Happy Path (Valid Creation) ---
  test("should create a new issue in the database", async () => {
    const validIssue = {
      title: "UI Flicker in Lobby",
      description: "The neon lights are flickering too fast.",
      category: "UI",
      lat: 34.0522,
      lng: -8.2437,
    };

    const response = await request(app).post("/api/issues").send(validIssue);

    // 1. Check status
    expect(response.status).toBe(201);

    // 2. Check for the structured "issues" array
    expect(response.body).toHaveProperty("issues");
    expect(Array.isArray(response.body.issues)).toBe(true);

    // 3. Drill into the formatted issue object
    const createdIssue = response.body.issues[0];
    expect(createdIssue).toHaveProperty("meta");
    expect(createdIssue.meta).toHaveProperty("id");
    expect(createdIssue.general.title).toBe(validIssue.title);
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
