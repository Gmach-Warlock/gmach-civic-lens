require("dotenv").config();

const { Sequelize } = require("sequelize");
console.log("Connecting to:", process.env.DB_NAME);
const db = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        dialect: "postgres",
        logging: false,
        define: {
          timestamps: true,
          underscored: true,
        },
      },
    );

const connectionPath =
  process.env.DATABASE_URL ||
  `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log("🚀 Attempting to connect to:", connectionPath);

module.exports = db;
