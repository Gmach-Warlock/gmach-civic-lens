const db = require("../models");
const Report = db.Report;
const { uuidRegex } = require("../utils/validation");

class ReportsController {
  static async createReport(req, res) {
    try {
      const { userId, lat, lng, description } = req.body;
      /* * 🌟 STAR METHODOLOGY GUARDS (Size, Type, Association, Range)
       * We run these guards BEFORE hitting the database. This prevents unhandled
       * DB crashes, protects against data type coercion, and ensures clean validation
       * failures return a clear 400 Bad Request instantly.
       */

      // --- 1. TYPE & REQUIREMENT GUARDS ---
      if (!userId || !description || lat === undefined || lng === undefined) {
        throw new Error("Missing required fields.");
      }

      // UUID Format Guard (Type)

      if (!uuidRegex.test(userId)) {
        throw new Error("userId must be a valid UUID.");
      }

      // Number Guard (Type)
      if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        isNaN(lat) ||
        isNaN(lng)
      ) {
        throw new Error("Latitude and Longitude must be valid numbers.");
      }

      // --- 2. SIZE/RANGE GUARDS ---
      if (lat < -90 || lat > 90) {
        throw new Error("Latitude must be between -90 and 90.");
      }
      if (lng < -180 || lng > 180) {
        throw new Error("Longitude must be between -180 and 180.");
      }

      // --- 3. DATABASE EXECUTION ---
      const report = await Report.create(req.body);

      console.log("Created report", report.toJSON());
      return res.status(201).json(report);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ReportsController;
