const reportsRouter = require("express").Router();
const ReportsController = require("../controllers/reportsController");

reportsRouter.post("/", ReportsController.createReport);
reportsRouter.get("/", ReportsController.getAllReports);
reportsRouter.get("/:id", ReportsController.getReportById);

module.exports = reportsRouter;
