const authRouter = require("express").Router();
const authController = require("../controllers/authController");
const { requireUser } = require("../middleware/auth");

authRouter.post("/create", authController.createUser);
authRouter.post("/login", authController.loginUser);

// protected routes
authRouter.get("/me", requireUser, authController.verifyUser);

module.exports = authRouter;
