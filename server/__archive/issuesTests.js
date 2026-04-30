const request = require("supertest");
const app = require("../src/app");

describe("Issues API", () => {
  // Test 1: GET all issues
  it("GET /api/issues should return an empty array initially", async () => {
    const res = await request(app).get("/api/issues");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  // Test 2: POST (Validation Failure)
  it("POST /api/issues should return 400 if title is missing", async () => {
    const res = await request(app)
      .post("/api/issues")
      .send({ description: "Testing validation" });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe("title and description are required");
  });

  // Test 3: POST (Success) and GET by ID
  it("POST /api/issues should create a new issue and retrieve it by ID", async () => {
    const newIssueData = {
      title: "Fix UI Bug",
      description: "The button is overlapping the header",
      category: "UI",
    };

    // Create the issue
    const postRes = await request(app).post("/api/issues").send(newIssueData);

    expect(postRes.statusCode).toEqual(201);
    const createdId = postRes.body.id;

    // Retrieve the issue by the ID we just got
    const getRes = await request(app).get(`/api/issues/${createdId}`);

    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body.title).toBe(newIssueData.title);
    expect(getRes.body.status).toBe("Open");
  });

  // Test 4: GET by ID (404 Not Found)
  it("GET /api/issues/:id should return 404 if ID does not exist", async () => {
    const res = await request(app).get("/api/issues/999");

    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe("Issue not found");
  });
});

describe("PUT & DELETE /api/issues/:id", () => {
  let testIssueId;

  // Create an issue before running these tests
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/issues")
      .send({ title: "Update Me", description: "Original" });
    testIssueId = res.body.id;
  });

  it("PUT /api/issues/:id should update the status and category", async () => {
    const res = await request(app)
      .put(`/api/issues/${testIssueId}`)
      .send({ status: "In Progress", category: "Hardware" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("In Progress");
    expect(res.body.category).toBe("Hardware");
    expect(res.body.title).toBe("Update Me"); // Title should remain unchanged
  });

  it("DELETE /api/issues/:id should remove the issue", async () => {
    const deleteRes = await request(app).delete(`/api/issues/${testIssueId}`);
    expect(deleteRes.statusCode).toEqual(204);

    // Verify it's actually gone
    const getRes = await request(app).get(`/api/issues/${testIssueId}`);
    expect(getRes.statusCode).toEqual(404);
  });
});
