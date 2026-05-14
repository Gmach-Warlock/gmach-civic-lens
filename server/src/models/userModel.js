const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true, notEmpty: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: "is_admin", // Explicitly maps camelCase to snake_case in your PG database
      },
    },
    {
      sequelize: db,
      modelName: "User",
      tableName: "users",
      underscored: true,
      paranoid: true,
    },
  );
  return User;
};
