const path = require("path");
const fs = require("fs");

// Go up ONE level: from server/config -> server
const envPath = path.join(__dirname, "..", ".env");

if (fs.existsSync(envPath)) {
  console.log("✅ .env file found in the server folder!");
} else {
  console.log("❌ .env NOT found at:", envPath);
}

require("dotenv").config({ path: envPath });

// Log the correct variable name from your .env
console.log("Found DB_USERNAME:", process.env.DB_USERNAME);

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "civiclens",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USERNAME,
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
