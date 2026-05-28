"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    "Location",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lat: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        validate: {
          min: { args: [-90], msg: "Latitude must be between -90 and 90." },
          max: { args: [90], msg: "Latitude must be between -90 and 90." },
        },
      },
      lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        validate: {
          min: { args: [-180], msg: "Longitude must be between -180 and 180." },
          max: { args: [180], msg: "Longitude must be between -180 and 180." },
        },
      },
      crossStreets: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "cross_streets",
      },
      locationName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "zip_code",
      },
    },
    {
      tableName: "locations",
      timestamps: true,
      underscored: true,
      validate: {
        hasValidLocationData() {
          const hasLat =
            this.lat !== null && this.lat !== undefined && this.lat !== "";
          const hasLng =
            this.lng !== null && this.lng !== undefined && this.lng !== "";
          const hasCoords = hasLat && hasLng;

          const hasCrossStreets =
            this.crossStreets && this.crossStreets.trim().length > 0;

          // Guard against half-filled coordinates
          if ((hasLat && !hasLng) || (!hasLat && hasLng)) {
            throw new Error(
              "Both Latitude and Longitude must be provided together.",
            );
          }

          // Guard against complete absence of positioning data
          if (!hasCoords && !hasCrossStreets) {
            throw new Error(
              "Either GPS coordinates or cross streets must be provided.",
            );
          }
        },
      },
    },
  );

  Location.associate = (models) => {
    Location.belongsTo(models.Issue, {
      foreignKey: "issue_id",
      as: "issue",
    });
  };

  return Location;
};
