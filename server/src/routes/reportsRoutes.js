const reportsRouter = require("express").Router();
const ReportsController = require("../controllers/reportsController");

reportsRouter.post("/", ReportsController.createReport);

module.exports = reportsRouter;
