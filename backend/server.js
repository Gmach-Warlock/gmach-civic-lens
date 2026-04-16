require("dotenv").config(); // 1. Load variables first!
const app = require("./src/app"); // 2. Load app
const db = require("./src/config/database");

const PORT = process.env.PORT;

db.authenticate()
  .then(() => {
    console.log("Database connection established.");

    return db.sync({ alter: true });
  })
  .then(() => {
    console.log("Database synced successfully.");

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB error:", err);
  });
