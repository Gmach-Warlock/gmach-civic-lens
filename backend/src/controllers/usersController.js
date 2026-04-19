const bcrypt = require("bcrypt");
const User = require("../models/usersModels");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

class UsersController {
  static async createUser(req, res) {
    try {
      const { general, meta } = req.body.user; // Extract based on your frontend's structure

      const { username, email, password, firstName, lastName, address } =
        general;

      const saltedPassword = await bcrypt.hash(password, 12);

      // 1. Create in DB (Database is usually flat)
      const newUser = await User.create({
        name: `${firstName} ${lastName}`.trim(),
        username,
        email,
        password: saltedPassword,
        address,
      });

      const responseData = {
        user: {
          general: {
            firstName: firstName,
            lastName: lastName,
            username: newUser.username,
            email: newUser.email,
            address: newUser.address,
          },
          meta: {
            createdAt: newUser.createdAt,
            lastLogin: newUser.createdAt,
            isAdmin: false,
          },
        },
        activity: { requests: [], comments: [] },
      };

      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.status(201).json({
        message: "User created!",
        ...responseData,
        token,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async loginUser(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      const { password: _, ...safeUser } = user.toJSON();

      res.status(200).json({
        message: "Login successful",
        token: token,
        user: safeUser,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UsersController;
