const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");

describe("GET issue by ID", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: false });
  });
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
