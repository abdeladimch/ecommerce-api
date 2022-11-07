const Review = require("../models/Review");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createReview = async (req, res) => {
  const { title, rating } = req.body;
  const { id: productId } = req.params;
  const { userId } = req.user;
  if (!title || !rating) {
    throw new CustomError.BadRequestError(
      "Must provide review title and rating!"
    );
  }
  const submittedReview = await Review.findOne({
    product: productId,
    createdBy: userId,
  });
  if (submittedReview) {
    throw new CustomError.BadRequestError(
      "Review for this product was already submitted!"
    );
  }
  req.body.createdBy = userId;
  req.body.product = productId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json(review);
};

const getAllReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId })
    .populate({
      path: "product",
      select: "name price company",
    })
    .populate({ path: "createdBy", select: "name email" });
  if (!reviews) {
    throw new CustomError.NotFoundError(
      `No reviews found for product with id ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const updateReview = async (req, res) => {
  const { id: productId } = req.params;
  const { userId } = req.user;
  const { title, rating, comment } = req.body;
  if (!title || !rating) {
    throw new CustomError.BadRequestError(
      "Please provide review title and rating!"
    );
  }
  const review = await Review.findOne({
    product: productId,
    createdBy: userId,
  });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found for product with id ${productId}`
    );
  }
  review.title = title;
  review.rating = rating;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json(review);
};

const deleteReview = async (req, res) => {
  const { id: productId } = req.params;
  const { userId } = req.user;
  const review = await Review.findOne({
    product: productId,
    createdBy: userId,
  });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found for product with id ${productId}`
    );
  }
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Review removed successfully!" });
};

const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.id });
  res.status(StatusCodes.OK).json(reviews);
};

module.exports = {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
  getProductReviews,
};
