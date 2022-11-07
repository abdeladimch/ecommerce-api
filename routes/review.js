const express = require("express");
const router = express.Router();

const {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review");

const { authUser, authPerms } = require("../middlewares/authMiddleware");

router.route("/:id").get(authUser, getAllReviews);
router
  .route("/:id")
  .post(authUser, createReview)
  .patch(authUser, updateReview)
  .delete(authUser, deleteReview);

module.exports = router;
