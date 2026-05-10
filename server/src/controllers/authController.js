const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const formatUserResponse = require("../utils/formatUserResponse");
const {
  passwordRegex,
  emailRegex,
  zipCodeRegex,
} = require("../utils/validation");

class AuthController {
  static async createUser(req, res) {
    console.log(req.body);
    try {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        address,
        city,
        zipCode,
      } = req.body;

      // --- LAYER 1: EXISTENCE GUARD ---
      if (
        !username ||
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        !address ||
        !city ||
        !zipCode
      ) {
        throw new Error("All fields are required.");
      }

      // --- LAYER 2: TYPE GUARD (Run this BEFORE regexes to prevent crashes) ---

      if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof firstName !== "string" ||
        typeof lastName !== "string" ||
        typeof address !== "string" ||
        typeof city !== "string" ||
        typeof zipCode !== "string"
      ) {
        throw new Error("All fields must be strings.");
      }

      // --- LAYER 3: FORMAT GUARDS (Stricter Regexes) ---
      if (!passwordRegex.test(password)) {
        throw new Error(
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character.",
        );
      }

      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
      }

      if (!zipCodeRegex.test(zipCode)) {
        throw new Error("Invalid zip code format.");
      }

      // --- PASSED ALL GUARDS -> Proceed to Hash and Create ---
      const saltedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        firstName,
        lastName,
        username,
        email,
        password: saltedPassword,
        address,
        city,
        zipCode,
      });

      const formatted = formatUserResponse(newUser);
      const accessToken = jwt.sign(
        { id: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      const refreshToken = jwt.sign(
        { id: newUser.id },
        process.env.JWT_REFRESH,
        { expiresIn: "7d" },
      );

      res.status(201).json({
        message: "User created!",
        accessToken,
        refreshToken,
        ...formatted,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const formatted = formatUserResponse(user);
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" },
      );
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH, {
        expiresIn: "7d",
      });
      res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        ...formatted,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async verifyUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const formatted = formatUserResponse(user);
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" },
      );
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH, {
        expiresIn: "7d",
      });

      res.status(200).json({
        message: "Token valid",
        accessToken,
        refreshToken,
        ...formatted,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
