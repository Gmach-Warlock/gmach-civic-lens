const usersRouter = require("express").Router();
const usersController = require("../controllers/usersController");

usersRouter.post("/create", usersController.createUser);

module.exports = usersRouter;
