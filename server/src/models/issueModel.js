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
        validate: { notEmpty: true },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "open",
      },
      urgency: {
        type: DataTypes.STRING,
        defaultValue: "medium", // Matches your front-end UrgencyType
      },
      upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Issue",
      tableName: "issues",
      underscored: true,
      paranoid: true,
    },
  );

  Issue.associate = (models) => {
    // 1. Every issue is posted by a User
    Issue.belongsTo(models.User, { foreignKey: "author_id", as: "author" });

    // 2. An issue has one specific physical location
    Issue.hasOne(models.Location, { foreignKey: "issue_id", as: "location" });

    // 3. An issue can have many comments
    Issue.hasMany(models.Comment, { foreignKey: "issue_id", as: "comments" });
  };

  return Issue;
};
