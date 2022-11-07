const CustomError = require("../errors");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const checkPerms = require("../utils/checkPerms");

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = "TestSecret";
  return { amount, clientSecret };
};

const createOrder = async (req, res) => {
  const { items: orderItems, tax, shippingFee } = req.body;

  if (!shippingFee || !tax) {
    throw new CustomError.BadRequestError(
      "Please provide shipping and tax fee!"
    );
  }

  if (!orderItems || orderItems.length < 1) {
    throw new CustomError.BadRequestError("Cart is empty!");
  }

  const orderItemsArr = [];
  let subtotal = 0;
  for (const item of orderItems) {
    const product = await Product.findOne({ _id: item.product });
    if (!product) {
      throw new CustomError.BadRequestError(
        `No product with id ${item.product} found!`
      );
    }
    const { name, image, price, _id } = product;
    const singleOrderItem = {
      name,
      price,
      image,
      product: _id,
      amount: item.amount,
    };
    orderItemsArr.push(singleOrderItem);
    subtotal += singleOrderItem.amount * singleOrderItem.price;
  }

  const total = subtotal + tax + shippingFee;
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    shippingFee,
    total,
    subtotal,
    tax,
    orderItems,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json(order);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  if (!orders) {
    throw new CustomError.BadRequestError(`No orders found!`);
  }
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getCurrUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  if (!orders) {
    throw new CustomError.BadRequestError(`You don't have any orders yet!`);
  }
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
  });
  if (!order) {
    throw new CustomError.BadRequestError(
      `No order with id ${req.params.id} found!`
    );
  }
  checkPerms(req.user, order.user);
  res.status(StatusCodes.OK).json(order);
};

const updateOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.user,
  });
  if (!order) {
    throw new CustomError.NotFoundError(
      `Couldn't find order with id ${req.params.id}`
    );
  }
  order.status = "paid";
  order.paymentIntentId = req.body.paymentIntentId;
  await order.save();
  res.status(StatusCodes.OK).json(order);
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  getCurrUserOrders,
};
