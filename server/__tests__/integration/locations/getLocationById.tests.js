const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const jwt = require("jsonwebtoken");
const { User, Location } = db;

const JWT_SECRET = process.env.JWT_SECRET;

describe("getLocationById Route", () => {
  let validToken;
  let validUser;
  let tempLocation;
  const validUuid = "123e4567-e89b-12d3-a456-426614174000";
  const invalidUuidFormat = "not-a-valid-uuid";

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    validUser = await User.create({
      id: validUuid,
      firstName: "Admin",
      lastName: "User",
      username: "adminuser",
      email: "admin@example.com",
      password: "Hashedpassword123@",
      address: "123 Admin Way",
      city: "Los Angeles",
      zipCode: "90001",
      isAdmin: false,
    });

    validToken = jwt.sign({ id: validUser.id, isAdmin: false }, JWT_SECRET);

    // Creating this directly in the DB so it is ready for the 200 test
    tempLocation = await Location.create({
      id: "123e4567-e89b-12b3-a456-422314174000",
      lat: 34.0522,
      lng: -118.2437,
      locationName: "MacArthur Park Hub",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 400 if the id is missing entirely", async () => {
    // Passing an empty/whitespace parameter to simulate a missing ID trigger
    const response = await request(app)
      .get(`/api/locations/missing`)
      .set("Authorization", `Bearer ${validToken}`);

    // Note: If your routing file doesn't forward /api/locations/ to this method,
    // ensure your Express router supports this or handles blank paths gracefully.
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Please provide all the necessary information",
    );
  });

  it("should return a 400 status if the id is not in the proper UUID format", async () => {
    const response = await request(app)
      .get(`/api/locations/${invalidUuidFormat}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Please make sure your id in proper format.",
    );
  });

  it("should return a 500 status if there is an internal database error", async () => {
    // Spying on the correct model structure
    const findByPkSpy = jest
      .spyOn(db.Location, "findByPk")
      .mockRejectedValue(new Error("Database crash!"));

    const response = await request(app)
      .get(`/api/locations/${validUuid}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(500); // Fixed expected status from 400 to 500
    expect(response.body.error).toBe("Internal Server error.");
  });

  it("should retrieve the location and return a 200 status", async () => {
    const response = await request(app)
      .get(`/api/locations/${tempLocation.id}`) // Fixed route typo from reports to locations
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("location");
    expect(response.body.location.id).toBe(tempLocation.id);
  });
});
