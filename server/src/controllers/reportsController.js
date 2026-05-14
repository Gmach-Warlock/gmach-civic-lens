const db = require("../models");
const Report = db.Report;
const { uuidRegex, noHtmlRegex } = require("../utils/validation");

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

  static async getAllReports(req, res) {
    try {
      const reports = await Report.findAll();
      return res.status(200).json({ reports });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getReportById(req, res) {
    try {
      const { id } = req.params;

      // 1. Validation Check (Rail 1)
      if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({
          message: "Please provide a valid report id", // Matches test expectations
        });
      }

      // 2. Fetch the report (Rail 4)
      const report = await Report.findByPk(id);

      // 3. Not Found Check (Rail 2)
      if (!report) {
        return res.status(404).json({
          message: "Report not found",
        });
      }

      // 4. Success Response
      return res.status(200).json({ report });
    } catch (error) {
      // 5. Database/Unexpected Errors (Rail 3)
      return res.status(500).json({
        error: error.message,
      });
    }
  }
  static async updateReport(req, res) {
    try {
      const { id } = req.params;
      const { status, severity, description, lat, lng } = req.body;

      // 1. GUARD: UUID Format
      if (!id || !uuidRegex.test(id)) {
        return res
          .status(400)
          .json({ message: "Please provide a valid report id" });
      }

      // 2. GUARD: Type & Range for Coordinates (if provided)
      if (lat !== undefined || lng !== undefined) {
        const latitude = Number(lat);
        const longitude = Number(lng);

        if (isNaN(latitude) || isNaN(longitude)) {
          return res
            .status(400)
            .json({ message: "Latitude and Longitude must be valid numbers." });
        }
        if (latitude < -90 || latitude > 90) {
          return res
            .status(400)
            .json({ message: "Latitude must be between -90 and 90." });
        }
        if (longitude < -180 || longitude > 180) {
          return res
            .status(400)
            .json({ message: "Longitude must be between -180 and 180." });
        }
      }

      // 3. GUARD: ENUM Validation for Severity
      const validSeverities = ["low", "medium", "high"];
      if (severity && !validSeverities.includes(severity)) {
        return res.status(400).json({
          message: "Invalid severity level. Must be low, medium, or high.",
        });
      }

      // 4. GUARD: XSS Prevention
      if (description && noHtmlRegex.test(description)) {
        return res
          .status(400)
          .json({ error: "No code is allowed in input fields!" });
      }

      // 5. FETCH & ACTUATE
      const report = await Report.findByPk(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      await report.update({
        status: status || report.status,
        severity: severity || report.severity,
        description: description || report.description,
        lat: lat !== undefined ? lat : report.lat,
        lng: lng !== undefined ? lng : report.lng,
      });

      return res.status(200).json(report);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteReport(req, res) {
    try {
      const { id } = req.params;

      // 1. GUARD: UUID Format
      if (!id || !uuidRegex.test(id)) {
        return res
          .status(400)
          .json({ message: "Please provide a valid report id" });
      }

      // 2. GUARD: Fetch Entity
      const report = await Report.findByPk(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // 3. ACTUATION: Delete record
      await report.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReportsController;
