const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name!"],
      trim: true,
      maxlength: [50, "Product name cannot be more than 50 characters long!"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price!"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description!"],
      maxlength: [
        150,
        "Product description cannot be more than 150 characters long!",
      ],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please upload product image!"],
    },
    inventory: {
      type: Number,
      default: 10,
    },
    colors: {
      type: [String],
      deafult: "none",
    },
    category: {
      type: [String],
      required: [true, "Please specify product category!"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Please provide product company!"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
  next();
});
module.exports = mongoose.model("Product", ProductSchema);
