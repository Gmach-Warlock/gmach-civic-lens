const db = require("../models");
const Report = db.Report;

class ReportsController {
  static async createReport(req, res) {
    try {
      const report = await Report.create(req.body);
      res.status(201).json({
        message: "Report created successfully",
        data: report,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ReportsController;
