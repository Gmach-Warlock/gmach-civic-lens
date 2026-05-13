const request = require("supertest");
const app = require("../../../src/app");
const db = require("../../../src/models");
const jwt = require("jsonwebtoken");

describe("createLocation Route", () => {
  let adminUser;
  let validAccessToken;

  // Global clean payload to reference/modify per test
  const validLocationPayload = {
    lat: 34.0522,
    lng: -118.2437,
    locationName: "MacArthur Park Hub",
  };

  beforeAll(async () => {
    // Force sync drops tables and recreates them cleanly
    await db.sequelize.sync({ force: true });

    adminUser = await db.User.create({
      id: "f0680d78-798b-41f1-820e-804310f75b11",
      firstName: "Admin",
      lastName: "User",
      username: "adminuser",
      email: "admin@example.com",
      password: "hashedpassword123",
      address: "123 Admin Way",
      city: "Los Angeles",
      zipCode: "90001",
      // If this is an authorization guard test, ensure this matches your logic requirements
      isAdmin: true,
    });

    validAccessToken = jwt.sign(
      { id: adminUser.id, isAdmin: true },
      process.env.JWT_SECRET || "YOUR_JWT_SECRET",
      { expiresIn: "1h" },
    );
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should return 401/403 if the accessToken is missing", async () => {
    const response = await request(app)
      .post("/api/locations/")
      .send(validLocationPayload);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Authentication token required.");
  });

  it("should return 400 if the required inputs are missing", async () => {
    // Empty body payload to trigger required input validation
    const response = await request(app)
      .post("/api/locations/")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Please provide all the required information on your form!",
    );
  });

  it("should return 400 if fields are not strings which need to be", async () => {
    const invalidTypesLocation = {
      ...validLocationPayload,
      name: ["Not", "A", "String"],
    };

    const response = await request(app)
      .post("/api/locations/")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send(invalidTypesLocation);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Please make sure all of your inputs are of proper type!",
    );
  });

  it("should return a 400 status if the zipCode is not in proper format", async () => {
    const invalidZipLocation = {
      ...validLocationPayload,
      zipCode: "900012-232",
    };

    const response = await request(app)
      .post("/api/locations/")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send(invalidZipLocation);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Please provide a valid zip code!");
  });

  it("should return 400 if any html is present in any of the inputs", async () => {
    const maliciousLocation = {
      ...validLocationPayload,
      name: "<script>alert('xss')</script> Park",
    };

    const response = await request(app)
      .post("/api/locations/")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send(maliciousLocation);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No code is allowed in input fields!");
  });

  it("should return 500 if there is an internal database error", async () => {
    const targetModel = db.Location || db.sequelize.models.Location;
    const dbSpy = jest
      .spyOn(targetModel, "create")
      .mockRejectedValue(new Error("Database connection loss"));

    try {
      const response = await request(app)
        .post("/api/locations/")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send(validLocationPayload);

      expect(response.status).toBe(500);
    } finally {
      // This is now guaranteed to execute even if the assertions above fail!
      dbSpy.mockRestore();
    }
  });

  it("should return a 200 status, and a confirmation message", async () => {
    const response = await request(app)
      .post("/api/locations/")
      .set("Authorization", `Bearer ${validAccessToken}`)
      .send(validLocationPayload);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Location successfully created!");
  });
});
