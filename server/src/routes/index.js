const router = require("express").Router();
const issuesRoutes = require("./issuesRoutes");
const authRoutes = require("./authRoutes");
const reportsRoutes = require("./reportsRoutes");
const locationsRoutes = require("./locationsRoutes");
const commentsRoutes = require("./commentsRoutes");

router.use("/issues", issuesRoutes);
router.use("/auth", authRoutes);
router.use("/reports", reportsRoutes);
router.use("/locations", locationsRoutes);
router.use("/comments", commentsRoutes);

module.exports = router;
