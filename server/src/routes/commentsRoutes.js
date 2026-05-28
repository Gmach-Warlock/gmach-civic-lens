const commentsRouter = require("express").Router({ mergeParams: true });
const commentsController = require("../controllers/commentsController");
const { requireUser } = require("../middleware/auth");

commentsRouter.use(requireUser);

commentsRouter.post("/", commentsController.createComment);
commentsRouter.get("/", commentsController.getAllComments);
commentsRouter.get("/:id", commentsController.getCommentById);
commentsRouter.put("/:id", commentsController.updateComment);
commentsRouter.delete("/:id", commentsController.deleteComment);

module.exports = commentsRouter;
