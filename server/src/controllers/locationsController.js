const db = require("../models");
// Pull out your global validation regexes
const { zipCodeRegex, noHtmlRegex, uuidRegex } = require("../utils/validation");
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
  static async updateLocation(req, res) {
    try {
      const { id } = req.params;
      const { lat, lng, locationName } = req.body;

      // 1. GUARD LAYER: Validate UUID Format (Now works because uuidRegex is global!)
      if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({
          message: "Please provide a valid location id",
        });
      }

      // 2. GUARD LAYER: Validate Coordinate Existence
      if (lat === undefined || lng === undefined) {
        return res.status(400).json({
          message: "Latitude and longitude are required fields.",
        });
      }

      // 3. GUARD LAYER: Validate Planetary Boundaries
      const latitude = Number(lat);
      const longitude = Number(lng);

      if (
        isNaN(latitude) ||
        latitude < -90 ||
        latitude > 90 ||
        isNaN(longitude) ||
        longitude < -180 ||
        longitude > 180
      ) {
        return res.status(400).json({
          message: "Coordinates are out of acceptable geographic boundaries.",
        });
      }

      // 4. GUARD LAYER: Fetch Entity (Changed from Location to locationModel)
      const location = await locationModel.findByPk(id);
      if (!location) {
        return res.status(404).json({
          message: "Location record not found",
        });
      }

      // 5. ACTUATION: Update Coordinates and Details
      await location.update({
        lat: latitude,
        lng: longitude,
        locationName: locationName
          ? locationName.trim()
          : location.locationName,
      });

      // Return the updated location entry
      return res.status(200).json(location);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  static async deleteLocation(req, res) {
    try {
      const { id } = req.params;

      // 1. GUARD LAYER: Validate UUID Format
      if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({
          message: "Please provide a valid location id",
        });
      }

      // 2. GUARD LAYER: Fetch Entity
      const location = await locationModel.findByPk(id);
      if (!location) {
        return res.status(404).json({
          message: "Location record not found",
        });
      }

      // 3. ACTUATION: Hard delete
      await location.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LocationsController;
