const db = require("../models");
const location = db.Location;

class LocationsController {
  static async getAllLocations(req, res) {
    try {
      console.log("Starting Fetching locations...");
      const locations = await location.findAll();
      console.log("Fetched locations:", locations);
      res.status(200).json({
        count: locations.length,
        locations: locations,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LocationsController;
