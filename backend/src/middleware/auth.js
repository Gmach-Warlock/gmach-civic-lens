const jwt = require("jsonwebtoken");
const { json } = require("sequelize");
const JWT_SECRET = process.env.JWT_SECRET;

const requireUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
  } catch (err) {
    return status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { requireUser };
