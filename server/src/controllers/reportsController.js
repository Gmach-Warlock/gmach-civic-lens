const db = require("../models");
const Report = db.Report;

class ReportsController {
  static async createReport(req, res) {
    try {
      const report = await Report.create(req.body);

      if (!report)
        throw new Error("Report creaion failed! Please check the input data.");

      return res.status(201).json(report);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ReportsController;
