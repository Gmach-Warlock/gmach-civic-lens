// Safely load dotenv only if we are NOT in the test environment
if (process.env.NODE_ENV !== "test") {
  require("dotenv").config();
}

const { Sequelize } = require("sequelize");

// 1. Assign defaults directly to the variables we will use
const dbName = process.env.DB_NAME || "civiclens_test";
const dbUser = process.env.DB_USERNAME || "postgres";
const dbPass = process.env.DB_PASSWORD || "password";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = Number(process.env.DB_PORT) || 5432;

console.log(
  "Connecting to Database:",
  dbName,
  "User:",
  dbUser,
  "Host:",
  dbHost,
);

// 2. Use the local variables, NOT process.env inside the constructor
const db = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      logging: false,
      define: { timestamps: true, underscored: true },
    })
  : new Sequelize(dbName, dbUser, dbPass, {
      host: dbHost,
      port: dbPort,
      dialect: "postgres",
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
      },
    });

// 3. Log the connection path using the local variables
const connectionPath =
  process.env.DATABASE_URL || `${dbHost}:${dbPort}/${dbName}`;
console.log("🚀 Attempting to connect to:", connectionPath);

module.exports = db;
