const request = require("supertest");
const app = require("../src/app");

describe("API Smoke Test", () => {
  it("should return 200 OK for the root path", async () => {
    const response = await request(app).get("/");
    expect(response.status).toEqual(200);
    expect(response.body.message).toBe("civicLens API is active!");
  });
});
