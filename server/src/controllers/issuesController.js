const db = require("../models");
const { Issue, Location, Comment, User } = db;
const formatIssuesResponse = require("../utils/formatIssuesResponse");
const { uuidRegex } = require("../utils/validation");

const issueAssociations = [
  {
    model: Location,
    as: "location",
  },
  {
    model: User,
    as: "author",
    attributes: ["id", "username", "firstName", "lastName"],
  },
  {
    model: Comment,
    as: "comments",
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username", "firstName", "lastName"],
      },
    ],
  },
];

class IssuesController {
  static async getAllIssues(req, res) {
    try {
      console.log("Hitting getAll", req.body);
      const issues = await Issue.findAll({
        include: issueAssociations,
        order: [["createdAt", "DESC"]],
      });

      const formattedData = formatIssuesResponse(issues);
      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createIssue(req, res) {
    try {
      // --- AUTHENTICATION GUARD LAYER ---
      const authenticatedUser = req.user;
      if (!authenticatedUser || !authenticatedUser.id) {
        return res.status(401).json({
          message: "Authentication is required to create an issue.",
        });
      }

      // 1. EXTRACT ALL DATA: Destructure city and zipCode alongside the others
      const {
        title,
        description,
        category,
        lat,
        lng,
        crossStreets,
        city,
        zipCode,
      } = req.body;

      // --- GUARD LAYER 1: Existence ---
      if (!title || !description || !category) {
        return res.status(400).json({
          message: "All fields (title, description, category) are required.",
        });
      }

      // --- GUARD LAYER 2: Types ---
      if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof category !== "string"
      ) {
        return res.status(400).json({
          message: "All inputs must be plain text strings.",
        });
      }

      if (crossStreets !== undefined && typeof crossStreets !== "string") {
        return res.status(400).json({
          message: "Cross streets input must be a plain text string.",
        });
      }

      // --- GUARD LAYER 3: Formats & Length ---
      if (title.trim().length < 5) {
        return res.status(400).json({
          message: "Title must be at least 5 characters long.",
        });
      }

      const hasCoords =
        lat !== undefined && lng !== undefined && lat !== null && lng !== null;
      const hasCrossStreets = crossStreets && crossStreets.trim().length > 0;
      const hasCity = city && city.trim().length > 0;
      const hasZip = zipCode && zipCode.trim().length > 0;

      if (!hasCoords && !hasCrossStreets && !hasCity && !hasZip) {
        return res.status(400).json({
          message:
            "Please provide a valid address, location, city, or zip code.",
        });
      }

      console.log("Received issue data: ", req.body);

      // Create core issue record
      const issue = await Issue.create({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        author_id: authenticatedUser.id,
      });

      // 2. DATA WRITE LAYER: Map all values straight into the Location record
      await Location.create({
        lat: hasCoords ? lat : null,
        lng: hasCoords ? lng : null,
        crossStreets: hasCrossStreets ? crossStreets.trim() : null,
        city: hasCity ? city.trim() : null, // <-- Pass clean city string
        zipCode: hasZip ? zipCode.trim() : null, // <-- Pass clean zipCode string
        issue_id: issue.id,
      });

      await issue.reload({
        include: issueAssociations,
      });

      const formatted = formatIssuesResponse(issue);

      res.status(201).json({
        message: "Issue created successfully",
        ...formatted,
      });
    } catch (error) {
      console.error("DEBUG CREATE ISSUE ERROR:", error);
      res.status(400).json({ error: error.message });
    }
  }
  static async upvoteIssue(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id; // Enforced via your auth middleware

      if (!id || !uuidRegex.test(id)) {
        return res
          .status(400)
          .json({ message: "Please provide a valid issue id" });
      }

      const issue = await Issue.findByPk(id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      // --- GUARD LAYER: Check for existing vote relation ---
      const existingVote = await db.IssueUpvote.findOne({
        where: {
          user_id: userId,
          issue_id: id,
        },
      });

      if (existingVote) {
        // User already upvoted -> Remove the vote relation (Toggle Off)
        await existingVote.destroy();
        await issue.decrement("upvotes", { by: 1 });
      } else {
        // User hasn't upvoted yet -> Create the vote relation (Toggle On)
        await db.IssueUpvote.create({
          user_id: userId,
          issue_id: id,
        });
        await issue.increment("upvotes", { by: 1 });
      }

      // Reload everything so the single source of truth format matches perfectly
      await issue.reload({ include: issueAssociations });
      const formatted = formatIssuesResponse(issue);

      res.status(200).json({
        message: existingVote
          ? "Upvote removed successfully"
          : "Upvote tracked successfully",
        ...formatted,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getIssueById(req, res) {
    try {
      const { id } = req.params;
      if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({
          message: "Please provide a valid issue id",
        });
      }

      const issue = await Issue.findByPk(id, { include: issueAssociations });
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      const formatted = formatIssuesResponse(issue);
      res.status(200).json(formatted);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateIssue(req, res) {
    try {
      const { id } = req.params;

      if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({
          message: "Please provide a valid issue id",
        });
      }

      const issue = await Issue.findByPk(id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      // Check Ownership before editing
      if (!req.user || issue.author_id !== req.user.id) {
        return res.status(403).json({
          message: "You do not have permission to modify this issue.",
        });
      }

      await issue.update(req.body);

      await issue.reload({ include: issueAssociations });
      res.status(200).json(formatIssuesResponse(issue));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteIssue(req, res) {
    try {
      const { id } = req.params;

      if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({
          message: "Please provide a valid issue id",
        });
      }

      const issue = await Issue.findByPk(id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      const currentUserId = req.user?.id;
      if (!currentUserId || issue.author_id !== currentUserId) {
        return res.status(403).json({
          message: "You do not have permission to delete this issue.",
        });
      }

      await issue.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = IssuesController;
