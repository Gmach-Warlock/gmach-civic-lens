require("dotenv").config();
const app = require("./src/app");
const db = require("./src/config/database");

const PORT = process.env.PORT || 4000;
let server;

db.authenticate()
  .then(() => {
    console.log("Database connection established.");
    return db.sync({ alter: true });
  })
  .then(() => {
    console.log("Database synced successfully.");
    server = app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB error:", err);
  });

process.on("SIGINT", async () => {
  console.log("\nStopping server...");

  if (server) {
    server.close(async () => {
      console.log("HTTP server closed.");

      try {
        await db.close();
        console.log("Database connection closed safely.");
        process.exit(0);
      } catch (err) {
        console.error("Error during DB shutdown:", err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
});
