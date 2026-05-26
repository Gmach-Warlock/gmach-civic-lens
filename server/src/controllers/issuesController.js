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
        include: [
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
        ],
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
      const { title, description, category, lat, lng, crossStreets } = req.body;

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

      // If crossStreets is provided, verify it's a string
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

      // Verify that we have at least one valid way to locate this issue
      const hasCoords =
        lat !== undefined && lng !== undefined && lat !== null && lng !== null;
      const hasCrossStreets = crossStreets && crossStreets.trim().length > 0;

      if (!hasCoords && !hasCrossStreets) {
        return res.status(400).json({
          message:
            "Please provide either GPS coordinates or valid cross streets/intersection.",
        });
      }

      console.log("Received issue data: ", req.body);

      // Create core issue record
      const issue = await Issue.create({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        author_id: req.user?.id || null,
      });

      // ALWAYS create a location row if we have either piece of geo-data
      if (hasCoords || hasCrossStreets) {
        await Location.create({
          lat: hasCoords ? lat : null,
          lng: hasCoords ? lng : null,
          crossStreets: hasCrossStreets ? crossStreets.trim() : null,
          issue_id: issue.id,
        });
      }

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
  static async getIssueById(req, res) {
    console.log("Searching for ID:", req.params.id);
    console.log("Issue Model defined?:", !!Issue);
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

      res.status(200).json({ issue });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async updateIssue(req, res) {
    try {
      const { id } = req.params;

      // --- GUARD LAYER: Validate UUID Format ---
      if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({
          message: "Please provide a valid issue id",
        });
      }

      const issue = await Issue.findByPk(id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      await issue.update(req.body);
      res.status(200).json(issue);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async deleteIssue(req, res) {
    try {
      const { id } = req.params;

      // 1. GUARD LAYER: Validate UUID Format
      if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({
          message: "Please provide a valid issue id",
        });
      }

      // 2. GUARD LAYER: Fetch Entity
      const issue = await Issue.findByPk(id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      // 3. GUARD LAYER: Ownership/Authorization Star Guard
      // Ensure the acting user owns this issue (or is an admin if your schema supports roles)
      const currentUserId = req.user?.id;
      if (!currentUserId || issue.author_id !== currentUserId) {
        return res.status(403).json({
          message: "You do not have permission to delete this issue.",
        });
      }

      // 4. ACTUATION: Perform Soft Delete
      // Because paranoid: true is set on the model, this sets deleted_at instead of running a SQL DELETE
      await issue.destroy();

      // 204 No Content is the standard for successful deletions
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = IssuesController;
