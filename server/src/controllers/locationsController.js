const db = require("../models");
const { zipCodeRegex, noHtmlRegex } = require("../utils/validation");
const locationModel = db.Location;

class LocationsController {
  static async getAllLocations(req, res) {
    try {
      console.log("Starting Fetching locations...");
      const locations = await locationModel.findAll();
      console.log("Fetched locations:", locations);
      return res.status(200).json({
        count: locations.length,
        locations: locations,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getLocationById(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.trim() === "" || id === "missing" || id === "null") {
        return res.status(400).json({
          error: "Please provide all the necessary information",
        });
      }

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[4321][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({
          error: "Please make sure your id in proper format.",
        });
      }

      // 3. Query Database
      const location = await locationModel.findByPk(id);
      if (!location) {
        return res.status(404).json({ error: "Location not found." });
      }

      return res.status(200).json({ location });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server error." });
    }
  }

  static async createLocation(req, res) {
    try {
      const { lat, lng, locationName, name, zipCode } = req.body;

      if (lat === undefined || lng === undefined) {
        return res.status(400).json({
          message: "Please provide all the required information on your form!",
        });
      }

      if (
        Array.isArray(name) ||
        Array.isArray(locationName) ||
        Array.isArray(zipCode)
      ) {
        return res.status(400).json({
          error: "Please make sure all of your inputs are of proper type!",
        });
      }

      if (zipCode !== undefined && zipCode !== null && zipCode !== "") {
        if (!zipCodeRegex.test(String(zipCode))) {
          return res.status(400).json({
            error: "Please provide a valid zip code!",
          });
        }
      }

      const textInputs = [locationName, name, zipCode];
      for (const input of textInputs) {
        if (input && typeof input === "string") {
          if (noHtmlRegex.test(input)) {
            return res.status(400).json({
              error: "No code is allowed in input fields!",
            });
          }
        }
      }

      const finalLocationName = locationName || name || "Unnamed Location";
      const formattedLat = Number(lat).toFixed(8);
      const formattedLng = Number(lng).toFixed(8);

      console.log("🚀 Executing database write to Sequelize model...");

      const newLocation = await locationModel.create({
        lat: formattedLat,
        lng: formattedLng,
        locationName: finalLocationName,
      });

      return res.status(200).json({
        message: "Location successfully created!",
        location: newLocation,
      });
    } catch (error) {
      console.log("🔥 Controller Caught Exception Structure:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LocationsController;
