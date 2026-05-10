const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { Issue } = db;

describe("GET issue by ID", () => {
  let tempIssue;

  beforeAll(async () => {
    await db.sequelize.sync({ force: false });
    tempIssue = await Issue.create({
      title: "Test Issue",
      description: "This is a temporary test issue",
      status: "open",
      category: "test",
      priority: "high",
    });
  });

  afterAll(async () => {
    if (tempIssue) {
      await Issue.destroy({ where: { id: tempIssue.id } });
    }
  });

  // --- RAIL 1: Invalid Format Guard (400) ---
  it("should return a status of 400, and a message asking for valid inputs if the id is invalid", async () => {
    const response = await request(app).get("/api/issues/not-a-valid-uuid");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please provide a valid issue id");
  });

  // --- RAIL 2: Valid Format but Doesn't Exist (404) ---
  it("should return a status of 404 and a message 'Issue not found' if the issue does not exist", async () => {
    // This is a syntactically perfect UUID, but it doesn't exist in our DB
    const nonExistentUuid = "a0000000-0000-0000-0000-000000000000";

    const response = await request(app).get(`/api/issues/${nonExistentUuid}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Issue not found");
  });

  // --- RAIL 3: Database/Server Crashes (500) ---
  it("should return a status of 500 if an unexpected database error occurs", async () => {
    // We intentionally force a database error by spying on Issue.findByPk
    // and forcing it to throw an unexpected database connection error.
    const findByPkSpy = jest
      .spyOn(db.Issue, "findByPk")
      .mockImplementationOnce(() => {
        throw new Error("Database connection lost");
      });

    const validUuid = "12345678-1234-1234-1234-123456789012";
    const response = await request(app).get(`/api/issues/${validUuid}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");

    // Clean up the spy so it doesn't break other tests
    findByPkSpy.mockRestore();
  });

  // --- RAIL 4: Success Case (200) ---
  it("should have an issue key", async () => {
    try {
      const tempIssue = await db.Issue.create({
        title: "Test",
        description: "Testing UUID",
        author: "Tester",
        category: "Test",
      });

      const response = await request(app).get(`/api/issues/${tempIssue.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("issue");
    } catch (error) {
      console.error(
        "DETAILED DB ERROR:",
        error.errors ? error.errors[0].message : error.message,
      );
      throw error;
    }
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
