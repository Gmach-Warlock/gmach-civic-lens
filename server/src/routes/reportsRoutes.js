const reportsRouter = require("express").Router();
const ReportsController = require("../controllers/reportsController");

reportsRouter.post("/create", ReportsController.createReport);

module.exports = reportsRouter;
