const Issue = require("../models/issuesModels");

class IssuesController {
  static async getAllIssues(req, res) {
    try {
      const issues = await Issue.findAll();
      res.status(200).json({
        count: issues.length,
        issues: issues,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async createIssue(req, res) {
    try {
      const issue = await Issue.create(req.body);
      res.status(201).json({
        message: "Issue created successfully",
        issue: issue,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getIssueById(req, res) {
    try {
      const issue = await Issue.findByPk(req.params.id);
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
