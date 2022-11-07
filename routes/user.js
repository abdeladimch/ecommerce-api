const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  showMe,
  updateUser,
  updateUserPassword,
} = require("../controllers/user");

const { authUser, authPerms } = require("../middlewares/authMiddleware");

router.route("/").get(authUser, authPerms("admin"), getAllUsers);
router.route("/showMe").get(authUser, showMe);
router.route("/updateUser").post(authUser, updateUser);
router.route("/updateUserPassword").post(authUser, updateUserPassword);
router.route("/:id").get(authUser, getSingleUser);

module.exports = router;
