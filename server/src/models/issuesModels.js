const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  class Issue extends Model {
    async markAsDuplicate() {
      this.status = "duplicate";
      return await this.save();
    }

    static async getByCategory(cat) {
      return await this.findAll({ where: { category: cat } });
    }
  }

  Issue.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "anonymous",
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      category: {
        type: DataTypes.STRING,
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: "open",
      },
      location_name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Issue",
      tableName: "issues",
      underscored: true,
    },
  );
  return Issue;
};
