const router = require("express").Router();
const issuesRoutes = require("./issuesRoutes");
const authRoutes = require("./authRoutes");
const reportsRoutes = require("./reportsRoutes");

router.use("/issues", issuesRoutes);
router.use("/auth", authRoutes);
router.use("/reports", reportsRoutes);

module.exports = router;
