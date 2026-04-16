const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
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
    sequelize: db,
    modelName: "Issue",
    tableName: "issues",
    underscored: true,
  },
);
module.exports = Issue;
