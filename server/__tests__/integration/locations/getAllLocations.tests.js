const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const location = db.Location;

describe("GET all locations", () => {
  beforeEach(async () => {
    await location.create({
      name: "Test Location",
      address: "123 Tewt St",
      city: "Testville",
      zipCode: "12345",
      lat: 40.71142,
      lng: -74.00555,
    });
  });

  it("should exist", async () => {
    try {
      const response = await request(app).get("/api/locations/");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("locations");
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  });
});
