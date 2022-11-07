const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  getCurrUserOrders,
} = require("../controllers/order");
const { authUser, authPerms } = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(authUser, authPerms("admin"), getAllOrders)
  .post(authUser, createOrder);

router.route("/showMyOrders").get(authUser, getCurrUserOrders);

router.route("/:id").get(authUser, getSingleOrder).patch(authUser, updateOrder);

module.exports = router;
