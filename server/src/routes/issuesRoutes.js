const issuesRouter = require("express").Router();
const commentsRouter = require("./commentsRoutes");
const IssuesController = require("../controllers/issuesController");
const { requireUser } = require("../middleware/auth");

issuesRouter.use(requireUser);

// 1. GENERIC TOP-LEVEL ROUTES
issuesRouter.get("/", IssuesController.getAllIssues);
issuesRouter.post("/", IssuesController.createIssue);

// 2. NESTED ROUTES & SPECIFIC PARAMETER ROUTES (Prioritized)
// Putting these before the generic /:id routes ensures they get matched first
issuesRouter.use("/:issueId/comments", commentsRouter);
issuesRouter.patch("/:id/upvote", IssuesController.upvoteIssue);

// 3. GENERIC CRUD ROUTES (Matched last)
issuesRouter.get("/:id", IssuesController.getIssueById);
issuesRouter.put("/:id", IssuesController.updateIssue);
issuesRouter.delete("/:id", IssuesController.deleteIssue);

module.exports = issuesRouter;
