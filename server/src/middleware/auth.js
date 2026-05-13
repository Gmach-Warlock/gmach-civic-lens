const jwt = require("jsonwebtoken");
const { uuidRegex } = require("../utils/validation");
const JWT_SECRET = process.env.JWT_SECRET;
const { User } = require("../../src/models");

const requireUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication token required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    // 1. Get the user ID from the DECODED token (attached to req.user by your auth middleware)
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Authentication required. Please log in." });
    }

    // 2. Query the database asynchronously
    const verifiedUser = await User.findByPk(userId);

    if (!verifiedUser) {
      return res.status(404).json({ error: "User not found in the database." });
    }

    // 3. Check if the user has admin privileges
    // (Adjust 'hasAdmin' to match whatever column/property name you use, e.g., role === 'admin')
    if (!verifiedUser.isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Administrator privileges required." });
    }

    // 4. Everything is good! Pass control to the next handler
    next();
  } catch (error) {
    console.error("Error in requireAdmin middleware:", error);
    return res
      .status(500)
      .json({ error: "Internal server error during authorization check." });
  }
};

module.exports = { requireUser, requireAdmin };
