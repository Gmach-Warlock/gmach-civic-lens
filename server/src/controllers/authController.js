const bcrypt = require("bcrypt");
const User = require("../models/usersModels");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const formatUserResponse = require("../utils/formatUserResponse");

class AuthController {
  static async createUser(req, res) {
    try {
      const { general } = req.body.user;
      const { username, email, password, firstName, lastName, address } =
        general;

      const saltedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        name: `${firstName} ${lastName}`.trim(),
        username,
        email,
        password: saltedPassword,
        address,
      });

      const formatted = formatUserResponse(newUser);
      const accessToken = jwt.sign(
        { id: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH, {
        expiresIn: "7d",
      });

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
