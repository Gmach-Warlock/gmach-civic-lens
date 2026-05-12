const locationsRouter = require("express").Router();
const locationsController = require("../controllers/locationsController");
const { requireUser } = require("../middleware/auth");

locationsRouter.use(requireUser);

locationsRouter.get("/", requireUser, locationsController.getAllLocations);

module.exports = locationsRouter;
