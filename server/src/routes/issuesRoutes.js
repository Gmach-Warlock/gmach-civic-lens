const issuesRouter = require("express").Router();
const IssuesController = require("../controllers/issuesController");

issuesRouter.get("/all", IssuesController.getAllIssues);
issuesRouter.post("/create", IssuesController.createIssue);
issuesRouter.get("/:id", IssuesController.getIssueById);
issuesRouter.put("/:id", IssuesController.updateIssue);
issuesRouter.delete("/:id", IssuesController.deleteIssue);

module.exports = issuesRouter;
