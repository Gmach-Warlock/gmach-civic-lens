const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const getJwtSecret = () => process.env.JWT_SECRET || "test-fallback-secret-123";
const getRefreshSecret = () => process.env.JWT_REFRESH || "refreshsecret";
const formatUserResponse = require("../utils/formatUserResponse");
const {
  passwordRegex,
  emailRegex,
  zipCodeRegex,
} = require("../utils/validation");

class AuthController {
  static async createUser(req, res) {
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
        theme,
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

      // --- LAYER 2: TYPE GUARD ---
      const fields = {
        username,
        email,
        password,
        firstName,
        lastName,
        address,
        city,
        zipCode,
      };
      if (Object.values(fields).some((val) => typeof val !== "string")) {
        throw new Error("All fields must be strings.");
      }

      // --- LAYER 3: FORMAT GUARDS ---
      if (!passwordRegex.test(password))
        throw new Error(
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character.",
        );
      if (!emailRegex.test(email)) throw new Error("Invalid email format.");
      if (!zipCodeRegex.test(zipCode))
        throw new Error("Invalid zip code format.");

      // --- CREATE USER ---
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
        theme: theme || "dark",
      });

      const formatted = formatUserResponse(newUser);
      const accessToken = jwt.sign(
        { id: newUser.id, username: newUser.username },
        getJwtSecret(),
        { expiresIn: "1h" },
      );
      const refreshToken = jwt.sign({ id: newUser.id }, getRefreshSecret(), {
        expiresIn: "7d",
      });

      res.status(201).json({
        message: "User created!",
        accessToken,
        refreshToken,
        ...formatted,
      });
    } catch (error) {
      console.error("🚨 Registration Error:", error);
      res.status(400).json({ error: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ error: "Please provide a valid email and password." });

      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const formatted = formatUserResponse(user);
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        getJwtSecret(),
        { expiresIn: "1h" },
      );
      const refreshToken = jwt.sign({ id: user.id }, getRefreshSecret(), {
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
      if (!req.user?.id)
        return res.status(401).json({ error: "Invalid or expired token." });

      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const formatted = formatUserResponse(user);
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        getJwtSecret(),
        { expiresIn: "1h" },
      );
      const refreshToken = jwt.sign({ id: user.id }, getRefreshSecret(), {
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
  static async updateUser(req, res) {
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
        theme, // 1. Destructure theme from request body
      } = req.body;

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: "Invalid email format." });
        }
      }

      // 2. Zip Code Format Guard
      if (zipCode) {
        // Matches 5 digits or 5+4 format
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(zipCode)) {
          return res.status(400).json({ error: "Invalid zip code format." });
        }
      }

      const updateFields = {};

      // ... existing email, zipCode, and password guards ...

      // 2. Add theme to the textFields object
      const textFields = {
        username,
        firstName,
        lastName,
        address,
        city,
        theme,
      };

      for (const [key, value] of Object.entries(textFields)) {
        if (value !== undefined) {
          if (typeof value !== "string") {
            return res.status(400).json({ error: `${key} must be a string.` });
          }
          updateFields[key] = value;
        }
      }

      await User.update(updateFields, {
        where: { id: req.user.id },
      });

      const updatedUser = await User.findByPk(req.user.id);
      const formatted = formatUserResponse(updatedUser);

      res.status(200).json({
        message: "User updated successfully",
        ...formatted,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      // --- LAYER 1: VALIDATE REQUEST CONTEXT ---
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Invalid or expired token." });
      }

      // --- LAYER 2: EXECUTE SEQUELIZE SOFT DELETE ---
      // Sequelize uses soft-deletion automatically if { paranoid: true } is set on the model definition.
      const rowsDeleted = await User.destroy({
        where: { id: req.user.id },
      });

      if (!rowsDeleted) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        message: "Account deactivated successfully",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
