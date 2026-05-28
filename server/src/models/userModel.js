const { Model } = require("sequelize");
// Import your regex to use it for model-level validation
const { zipCodeRegex } = require("../utils/validation");

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
        type: DataTypes.TEXT, // Note: standard practice usually uses STRING(255) unless you expect massive usernames
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
        validate: {
          isValidZip(value) {
            // Only validate if a ZIP code is actually provided (since allowNull is true)
            if (value && !zipCodeRegex.test(value)) {
              throw new Error("Invalid US Zip Code format.");
            }
          },
        },
      },
      theme: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "system", // 'light', 'dark', or 'system'
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: "is_admin",
      },
    },
    {
      sequelize, // Use the instance passed into the module wrapper
      modelName: "User",
      tableName: "users",
      underscored: true,
      paranoid: true, // Enables soft deletes (requires deleted_at column in DB)
    },
  );

  return User;
};
