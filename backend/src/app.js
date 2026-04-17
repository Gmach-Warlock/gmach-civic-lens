const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/index");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "civicLens API is active!" });
});

module.exports = app;
