const usersRouter = require("express").Router();
const usersController = require("../controllers/usersController");

usersRouter.post("/create", usersController.createUser);
usersRouter.post("/login", usersController.loginUser);

module.exports = usersRouter;
