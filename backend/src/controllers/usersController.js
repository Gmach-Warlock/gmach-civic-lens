const bcrypt = require("bcrypt");
const User = require("../models/usersModels");

const JWT_SECRET = process.env.JWT_SECRET;

class UsersController {
  static async createUser(req, res) {
    try {
      console.log(req.body);
      const saltedPassword = await bcrypt.hash(req.body.password, 12);
      const newUserObject = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: saltedPassword,
      };
      const newUser = await User.create(newUserObject);
      console.log(newUser);
      res.status(201).json({
        message: "User created successfully",
        user: newUser,
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

      res.status(200).json({
        message: "Login successful",
        token: token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UsersController;
