const reportsRouter = require("express").Router();
const reportsController = require("../controllers/reportsController");
const { requireUser, requireAdmin } = require("../middleware/auth");

reportsRouter.use(requireUser, requireAdmin);

reportsRouter.post("/", reportsController.createReport);
reportsRouter.get("/", reportsController.getAllReports);
reportsRouter.get("/:id", reportsController.getReportById);

module.exports = reportsRouter;
