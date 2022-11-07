const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [50, "Review title cannot be more than 50 characters long!"],
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [
        200,
        "Review comment cannot be more than 200 characters long!",
      ],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, createdBy: 1 }, { unique: true });

ReviewSchema.statics.avgRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  await this.model("Product").findOneAndUpdate(
    { _id: productId },
    {
      avgRating: result[0]?.avgRating || 0,
      numOfReviews: result[0]?.numOfReviews || 0,
    }
  );
};

ReviewSchema.post("save", async function () {
  await this.constructor.avgRating(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.avgRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
