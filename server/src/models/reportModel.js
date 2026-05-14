"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    async markAsDuplicate() {
      this.status = "duplicate";
      return await this.save();
    }
  }

  Report.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: { notEmpty: true },
      },
      issueId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "open",
      },
      severity: {
        type: DataTypes.ENUM("low", "medium", "high"),
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      lat: {
        type: DataTypes.FLOAT,
      },
      lng: {
        type: DataTypes.FLOAT,
      },
      locationName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize, // This now uses the sequelize instance passed in by index.js
      modelName: "Report",
      tableName: "reports",
      underscored: true,
      paranoid: true,
    },
  );

  return Report;
};
