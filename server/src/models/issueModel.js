const { Model } = require("sequelize");

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
        defaultValue: "medium",
      },
      upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // Explicitly define foreign key parameter for validation layers
      author_id: {
        type: DataTypes.UUID,
        allowNull: false, // Enforces database level constraint
        validate: {
          notNull: { msg: "An issue must belong to an authenticated author." },
        },
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
    // Every issue MUST be posted by a User
    Issue.belongsTo(models.User, {
      foreignKey: {
        name: "author_id",
        allowNull: false,
      },
      as: "author",
    });

    Issue.hasOne(models.Location, { foreignKey: "issue_id", as: "location" });
    Issue.hasMany(models.Comment, { foreignKey: "issue_id", as: "comments" });
  };

  return Issue;
};
