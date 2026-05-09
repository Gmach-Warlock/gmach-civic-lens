const locationsRouter = require("express").Router();
const locationsController = require("../controllers/locationsController");

locationsRouter.get("/", locationsController.getAllLocations);

module.exports = locationsRouter;
