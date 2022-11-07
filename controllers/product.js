const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json(product);
};

const getAllProducts = async (req, res) => {
  const products = await Product.find();
  if (!products) {
    throw new CustomError.NotFoundError("No products found");
  }
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      `Couldn't find product with id ${productId} !`
    );
  }
  res.status(StatusCodes.OK).json(product);
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const { userId } = req.user;
  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      createdBy: userId,
    },
    req.body,
    { runValidators: true, new: true }
  );
  if (!product) {
    throw new CustomError.NotFoundError(
      `Couldn't find product with id ${id} !`
    );
  }
  res.status(StatusCodes.OK).json(product);
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const { userId } = req.user;
  const product = await Product.findOne({ _id: productId, createdBy: userId });
  if (!product) {
    throw new CustomError.NotFoundError(
      `Couldn't find product with id ${id} !`
    );
  }
  product.remove();
  res.status(StatusCodes.OK).json({ msg: "Product removed successfully!" });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded!");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image!");
  }
  const maxSize = 1024 * 1024 * 5;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Image size cannot be more then 5MB!"
    );
  }
  const imagePath = path.join(
    __dirname,
    `../public/uploads/${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ msg: "Image uploaded successfully!" });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
