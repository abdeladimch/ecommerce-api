const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/product");

const { getProductReviews } = require("../controllers/review");

const { authUser, authPerms } = require("../middlewares/authMiddleware");
router
  .route("/")
  .get(authUser, getAllProducts)
  .post(authUser, authPerms("admin"), createProduct);

router.route("/uploadImage").post(authUser, authPerms("admin"), uploadImage);

router
  .route("/:id")
  .get(authUser, getSingleProduct)
  .patch(authUser, authPerms("admin"), updateProduct)
  .delete(authUser, authPerms("admin"), deleteProduct);

router.route("/:id/reviews").get(getProductReviews);

module.exports = router;
