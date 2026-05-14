require("dotenv").config();
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const db = require("../../../src/models");
const { User } = db;

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

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

describe("loginUser route", () => {
  let validUser;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    // Password should be pre-hashed in db hooks or handled accordingly.
    // Assuming model hooks handle hashing or bcrypt is handled manually:
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(userDataTemplate.password, 12);

    validUser = await User.create({
      ...userDataTemplate,
      password: hashedPassword,
    });
  });

  it("should return a 400 status if the email/username or password is missing", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "john@example.com", // missing password
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Please provide a valid email and password.",
    );
  });

  it("should return a 400 status if the email or password are of the wrong format", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "wrongemailformat",
      password: "Password123!",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Please use the proper email and password formats.",
    );
  });

  it("should return a status of 500 if an unexpected database error occurs", async () => {
    const findOneSpy = jest
      .spyOn(User, "findOne")
      .mockImplementationOnce(() => {
        throw new Error("Database connection lost");
      });

    const response = await request(app)
      .post(`/api/auth/login`)
      .send({ email: "john@example.com", password: "Password123!" });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");

    findOneSpy.mockRestore();
  });

  it("should successfully log in a valid user and return a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: userDataTemplate.email,
      password: userDataTemplate.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken"); // Controller outputs accessToken, not token

    const decoded = jwt.verify(res.body.accessToken, JWT_SECRET);
    expect(decoded.id).toBe(validUser.id);
  });
});
