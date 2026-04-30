const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

class User extends Model {
  async markAsDuplicate() {
    this.status = "duplicate";
    return await this.save();
  }

  static async getByCategory(cat) {
    return await this.findAll({ where: { category: cat } });
  }
}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "User",
    tableName: "users",
    underscored: true,
  },
);
module.exports = User;
