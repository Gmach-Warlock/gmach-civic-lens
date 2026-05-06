const path = require("path");
// This literally says: "Start here, go up one, find .env"
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// This will tell us exactly where Node is looking
console.log("Looking for .env at:", path.join(__dirname, "..", ".env"));
console.log("Found DB_USER:", process.env.DB_USER);

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "civiclens",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "civiclens_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
