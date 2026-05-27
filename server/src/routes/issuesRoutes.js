const issuesRouter = require("express").Router();

const IssuesController = require("../controllers/issuesController");
const { requireUser } = require("../middleware/auth");

issuesRouter.use(requireUser);

issuesRouter.get("/", IssuesController.getAllIssues);
issuesRouter.post("/", IssuesController.createIssue);

// --- PLACE SPECIFIC SUB-ROUTES ABOVE GENERIC CRUD PARAMETERS ---
issuesRouter.patch("/:id/upvote", IssuesController.upvoteIssue);

issuesRouter.get("/:id", IssuesController.getIssueById);
issuesRouter.put("/:id", IssuesController.updateIssue);
issuesRouter.delete("/:id", IssuesController.deleteIssue);

module.exports = issuesRouter;
