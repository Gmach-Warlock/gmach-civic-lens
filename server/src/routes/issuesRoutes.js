const issuesRouter = require("express").Router();
const IssuesController = require("../controllers/issuesController");

issuesRouter.get("/", IssuesController.getAllIssues);
issuesRouter.post("/", IssuesController.createIssue);
issuesRouter.get("/:id", IssuesController.getIssueById);
issuesRouter.put("/:id", IssuesController.updateIssue);
issuesRouter.delete("/:id", IssuesController.deleteIssue);

module.exports = issuesRouter;
