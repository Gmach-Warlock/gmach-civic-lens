const request = require("supertest");
const db = require("../src/models");
const Issue = db.Issue;

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

  afterAll(async () => {
    if (db.sequelize) {
      await db.sequelize.close();
    }
  });

  test("should create a new issue in the database", async () => {
    const data = {
      title: "UI Flicker in Lobby",
      description: "The neon lights are flickering too fast.",
      category: "UI",
    };

    const newIssue = await db.Issue.create(data);

    expect(newIssue).toHaveProperty("id");
    expect(newIssue.title).toBe(data.title);
  });
});

afterAll(async () => {
  await db.sequelize.close(); // Close the "Engine"
});
