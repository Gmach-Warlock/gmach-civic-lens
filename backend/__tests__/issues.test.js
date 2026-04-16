const request = require("supertest");
const { Issue } = require("../src/models/issuesModels");
const db = require("../src/config/database");

describe("Issue Model TDD = Database Integration", () => {
  beforeEach(async () => {
    try {
      await db.query("TRUNCATE TABLE issues RESTART IDENTITY CASCADE", {
        type: db.QueryTypes.RAW,
      });
    } catch (error) {
      console.error("Cleanup Error:", error.message);
      throw error;
    }
  });

  afterAll(async () => {
    await db.close();
  });

  test("should create a new issue in the database", async () => {
    const data = {
      title: "UI Flicker in Lobby",
      description: "The neon lights are flickering too fast.",
      category: "UI",
    };

    const newIssue = await Issue.create(data);

    expect(newIssue).toHaveProperty("id");
    expect(newIssue.title).toBe(data.title);
  });
});
