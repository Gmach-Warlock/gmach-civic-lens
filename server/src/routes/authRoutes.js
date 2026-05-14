const authRouter = require("express").Router();
const authController = require("../controllers/authController");
const { requireUser } = require("../middleware/auth");

authRouter.post("/register", authController.createUser);
authRouter.post("/login", authController.loginUser);

// protected routes
authRouter.get("/me", requireUser, authController.verifyUser);
authRouter.put("/me", requireUser, authController.updateUser);
authRouter.delete("/me", requireUser, authController.deleteUser);

module.exports = authRouter;
