const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/index");

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "civicLens API is active!" });
});

module.exports = app;

/* import { randomBytes } from "crypto"; */

/**
 * Replaces the old 'possible' string loop with a
 * cryptographically secure hex generator.
 */
/* export const generateSecureID = (length: number = 16): string => {
  // 16 bytes = 32 hex characters
  return randomBytes(length).toString('hex');
}; */
