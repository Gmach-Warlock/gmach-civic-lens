const db = require("../models");
const { Comment } = db;
const { uuidRegex } = require("../utils/validation");

class CommentsController {
  static async createComment(req, res) {
    try {
      const { content, issue_id } = req.body;
      const author_id = req.user.id; // Assigned from your auth middleware

      // 1. Check for missing required inputs
      if (!content || !issue_id) {
        return res.status(400).json({
          message: "Please provide all the required information on your form!",
        });
      }

      // 2. Type validation (Must be string)
      if (typeof content !== "string" || typeof issue_id !== "string") {
        return res.status(400).json({
          error: "Please make sure all of your inputs are of proper type!",
        });
      }

      // 3. Simple HTML/Code regex check to block malicious tags
      const htmlRegex = /<[^>]*>/g;
      if (htmlRegex.test(content) || htmlRegex.test(issue_id)) {
        return res.status(400).json({
          error: "No code is allowed in input fields!",
        });
      }

      // 4. Attempt to save to database
      await Comment.create({
        content,
        issue_id,
        author_id,
      });

      return res.status(200).json({
        message: "Comment successfully created!",
      });
    } catch (error) {
      // Catches the connection loss / model rejects
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllComments(req, res) {
    try {
      const comments = await Comment.findAll();

      // Send them back with a 200 status
      return res.status(200).json({ comments });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getCommentById(req, res) {
    try {
      const { id } = req.params;

      const comment = await Comment.findByPk(id);

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
      const comment = await Comment.findByPk(id);
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
      const comment = await Comment.findByPk(id);
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
