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
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
        },
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
