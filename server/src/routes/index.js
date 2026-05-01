const router = require("express").Router();
const issuesRoutes = require("./issuesRoutes");
const authRoutes = require("./authRoutes");

router.use("/issues", issuesRoutes);
router.use("/auth", authRoutes);

module.exports = router;
