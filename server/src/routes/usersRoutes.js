const usersRouter = require("express").Router();
const usersController = require("../controllers/usersController");
const { requireUser } = require("../middleware/auth");

usersRouter.post("/create", usersController.createUser);
usersRouter.post("/login", usersController.loginUser);

// protected routes
usersRouter.get("/me", requireUser, usersController.verifyUser);

module.exports = usersRouter;
