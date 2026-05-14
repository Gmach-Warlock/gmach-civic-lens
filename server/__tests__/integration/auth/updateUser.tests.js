require("dotenv").config();
process.env.JWT_SECRET = "testsecret";
process.env.JWT_REFRESH = "refreshsecret";
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User } = db;

const JWT_SECRET = process.env.JWT_SECRET;

const userDataTemplate = {
  username: "johndoe",
  email: "john@example.com",
  password: "Password123!",
  firstName: "John",
  lastName: "Doe",
  address: "123 Main St",
  city: "Los Angeles",
  zipCode: "90028",
};

describe("updateUser route", () => {
  let validUser;
  let validToken;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(userDataTemplate.password, 12);

    validUser = await User.create({
      ...userDataTemplate,
      password: hashedPassword,
    });

    validToken = jwt.sign(
      { id: validUser.id, username: validUser.username },
      JWT_SECRET,
      { expiresIn: "1h" },
    );
  });

  it("should successfully update user profile details with a valid token", async () => {
    const response = await request(app)
      .put("/api/auth/me") // Assuming PUT to /me handles the updates
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        firstName: "Johnny",
        address: "456 New St",
        city: "San Francisco",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");
    expect(response.body.user.general.firstName).toBe("Johnny");
    expect(response.body.user.general.address).toBe("456 New St");
    // Ensure untouched fields remain intact
    expect(response.body.user.general.lastName).toBe(validUser.lastName);
  });

  it("should return a 400 status if an invalid email format is provided", async () => {
    const response = await request(app)
      .put("/api/auth/me")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        email: "not-an-email",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid email format.");
  });

  it("should return a 400 status if an invalid zip code format is provided", async () => {
    const response = await request(app)
      .put("/api/auth/me")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        zipCode: "abc",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid zip code format.");
  });

  it("should return a status of 500 if a database crash occurs during update", async () => {
    const updateSpy = jest.spyOn(User, "update").mockImplementationOnce(() => {
      throw new Error("Database update failed");
    });

    const response = await request(app)
      .put("/api/auth/me")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ firstName: "ErrorTrigger" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Database update failed");

    updateSpy.mockRestore();
  });
});
