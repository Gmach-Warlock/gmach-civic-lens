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
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        validate: {
          min: -180,
          max: 180,
        },
      },
      crossStreets: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "cross_streets", // ensures underscored DB column mapping
      },
      locationName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "locations",
      timestamps: true,
      underscored: true,
      validate: {
        hasValidLocationData() {
          const hasCoords = this.lat !== null && this.lng !== null;
          const hasCrossStreets =
            this.crossStreets && this.crossStreets.trim().length > 0;

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
