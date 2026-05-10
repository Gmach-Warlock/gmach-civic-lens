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
      const issues = await Issue.findAll({
        include: [
          // 1. Include the associated Location
          {
            model: Location,
            as: "location", // Must match the "as" alias in your model association
          },
          // 2. Include the Author of the Issue (User)
          {
            model: User,
            as: "author",
            attributes: ["id", "username", "firstName", "lastName"], // Only select public info
          },
          // 3. Include the Comments, and nested inside each comment, include its author!
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

      // Send it to your beautiful formatter!
      const formattedData = formatIssuesResponse(issues);

      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async createIssue(req, res) {
    try {
      const { title, description, category, lat, lng } = req.body;

      // --- GUARD LAYER 1: Existence (Crucial: Added "return" to stop execution!) ---
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

      // --- GUARD LAYER 3: Formats & Length ---
      if (title.trim().length < 5) {
        return res.status(400).json({
          message: "Title must be at least 5 characters long.",
        });
      }

      console.log("Received issue data: ", req.body);

      // 1. Create the base issue
      // We explicitly pass the expected fields rather than the raw req.body for safety
      const issue = await Issue.create({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        authorId: req.user?.id || null, // Capture logged-in user if available!
      });

      // 2. If coordinates are provided, create the associated Location!
      if (lat !== undefined && lng !== undefined) {
        await Location.create({
          lat,
          lng,
          issueId: issue.id, // Linking it back to our new issue!
        });
      }

      // 3. THE BOSS MOVE: Reload the issue with all associated tables joined!
      await issue.reload({
        include: issueAssociations,
      });

      // 4. Format and return the perfectly unified object!
      const formatted = formatIssuesResponse(issue);

      res.status(201).json({
        message: "Issue created successfully",
        ...formatted, // Spreads the { issues: [...] } array cleanly!
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
      const issue = await Issue.findByPk(req.params.id);
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
      const issue = await Issue.findByPk(req.params.id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      await issue.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = IssuesController;
