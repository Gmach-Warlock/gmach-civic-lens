const locationsRouter = require("express").Router();
const locationsController = require("../controllers/locationsController");
const { requireUser } = require("../middleware/auth");

locationsRouter.use(requireUser);

locationsRouter.get("/", locationsController.getAllLocations);
locationsRouter.post("/", locationsController.createLocation);
locationsRouter.get("/:id", locationsController.getLocationById);
locationsRouter.put("/:id", locationsController.updateLocation);
locationsRouter.delete("/:id", locationsController.deleteLocation);

module.exports = locationsRouter;
