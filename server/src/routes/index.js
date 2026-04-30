const router = require("express").Router();
const issuesRoutes = require("./issuesRoutes");
const usersRoutes = require("./usersRoutes");

router.use("/issues", issuesRoutes);
router.use("/users", usersRoutes);

module.exports = router;
