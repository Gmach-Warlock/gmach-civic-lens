const db = require("../models");
const { uuidRegex } = require("../utils/validation");

class CommentsController {
  static async createComment(req, res) {
    try {
      const { content } = req.body;

      // Fallback: Check req.params (for frontend) OR req.body (for your test runner)
      const issueId = req.params.issueId || req.body.issue_id;
      const author_id = req.user?.id;

      console.log(
        "DEBUGGING - Received content:",
        content,
        "Received issueId:",
        issueId,
      );
      console.log("DEBUG: Params issueId:", req.params.issueId);
      console.log("DEBUG: Body issue_id:", req.body.issue_id);

      // 1. EXISTENCE GUARD
      if (!content || !issueId || content.toString().trim() === "") {
        return res.status(400).json({
          message: "Please provide all the required information on your form!",
        });
      }

      // 2. STRENGTHENED TYPE GUARD
      // We check that content is a string AND issueId is a string (UUIDs are strings)
      if (typeof content !== "string" || typeof issueId !== "string") {
        return res.status(400).json({
          error: "Please make sure all of your inputs are of proper type!",
        });
      }

      // 3. ANTI-XSS GUARD
      const htmlRegex = /<[^>]*>/g;
      if (htmlRegex.test(content) || htmlRegex.test(issueId)) {
        return res.status(400).json({
          error: "No code is allowed in input fields!",
        });
      }

      // --- LAYER 1: EXISTENCE GUARD ---
      if (!content || !issueId || content.trim() === "") {
        return res.status(400).json({
          message: "Please provide all the required information on your form!",
        });
      }

      // --- LAYER 2: TYPE GUARD ---
      if (typeof content !== "string" || typeof issueId !== "string") {
        return res.status(400).json({
          error: "Please make sure all of your inputs are of proper type!",
        });
      }

      // --- ACTUATION: DATABASE WRITE ---
      const newComment = await db.Comment.create({
        content: content.trim(),
        issue_id: issueId,
        author_id,
      });

      // Fetch the newly created comment along with user associations for the frontend
      const structuredComment = await db.Comment.findByPk(newComment.id, {
        include: [
          {
            model: db.User,
            as: "author",
            attributes: ["id", "username", "firstName", "lastName"],
          },
        ],
      });

      // --- RESPONSE LAYER ---
      // Return 200 to satisfy createComment.tests.js, while providing the structured object for Redux
      return res.status(200).json({
        message: "Comment successfully created!",
        comment: {
          id: structuredComment.id,
          content: structuredComment.content,
          createdAt: structuredComment.createdAt,
          author: structuredComment.author,
        },
      });
    } catch (error) {
      // Catches the connection loss / model rejects explicitly requested by the 500 test
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllComments(req, res) {
    try {
      const comments = await db.Comment.findAll();

      // Send them back with a 200 status
      return res.status(200).json({ comments });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getCommentById(req, res) {
    try {
      const { id } = req.params;

      const comment = await db.Comment.findByPk(id);

      if (!comment) {
        return res.status(404).json({ error: "Comment not found." });
      }

      return res.status(200).json({ comment });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      // 1. GUARD LAYER: Validate UUID Format
      if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({
          message: "Please provide a valid comment id",
        });
      }

      // 2. GUARD LAYER: Validate Body Content Existence
      if (!content || content.trim() === "") {
        return res.status(400).json({
          message: "Content is required and cannot be empty.",
        });
      }

      // 3. GUARD LAYER: Fetch Entity
      const comment = await db.Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }

      // 4. GUARD LAYER: Star Guard Authorization Check
      const currentUserId = req.user?.id;
      if (!currentUserId || comment.author_id !== currentUserId) {
        return res.status(403).json({
          message: "You do not have permission to edit this comment.",
        });
      }

      // 5. ACTUATION: Update Record
      await comment.update({
        content: content.trim(),
      });

      // Return the updated comment with a 200 OK status
      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  static async deleteComment(req, res) {
    try {
      const { id } = req.params;

      // 1. GUARD LAYER: Validate UUID Format
      if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({
          message: "Please provide a valid comment id",
        });
      }

      // 2. GUARD LAYER: Fetch Entity
      const comment = await db.Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }

      // 3. GUARD LAYER: Star Guard Authorization Check
      const currentUserId = req.user?.id;
      if (!currentUserId || comment.author_id !== currentUserId) {
        return res.status(403).json({
          message: "You do not have permission to delete this comment.",
        });
      }

      // 4. ACTUATION: Hard delete for comments (or soft if preferred)
      await comment.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CommentsController;
