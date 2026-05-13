const commentsRouter = require("express").Router();
const commentsController = require("../controllers/commentsController");
const { requireUser } = require("../middleware/auth");

commentsRouter.use(requireUser);

commentsRouter.post("/", commentsController.createComment);
commentsRouter.get("/", commentsController.getAllComments);
commentsRouter.get("/:id", commentsController.getCommentById);

module.exports = commentsRouter;
