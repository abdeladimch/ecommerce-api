const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const checkPerms = require("../utils/checkPerms");
const bcrypt = require("bcrypt");
const jwt = require("../utils/index");

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  if (!users) {
    throw new CustomError.NotFoundError("No users found!");
  }
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id ${id} found!`);
  }
  checkPerms(req.user, id);
  res.status(StatusCodes.OK).json(user);
};

const showMe = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId }).select("-password");
  res.status(StatusCodes.OK).json(user);
};

const updateUser = async (req, res) => {
  const { userId } = req.user;
  req.body.role = req.user.role;
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    runValidators: true,
    new: true,
  });
  const userToken = jwt.createToken(user);
  jwt.attachCookiesToRes(res, userToken);
  res.status(StatusCodes.OK).json(user);
};

const updateUserPassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Must provide old and new password to proceed!"
    );
  }
  if (newPassword.length < 8) {
    throw new CustomError.BadRequestError(
      "Password must be more than 8 characters long!"
    );
  }
  const user = await User.findOne({ _id: userId });
  if (await bcrypt.compare(oldPassword, user.password)) {
    user.password = newPassword;
    user.save();
    const userToken = jwt.createToken(user);
    jwt.attachCookiesToRes(res, userToken);
    return res.status(StatusCodes.OK).json({ msg: "Password updated!" });
  }
  throw new CustomError.BadRequestError("Please enter correct password!");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showMe,
  updateUser,
  updateUserPassword,
};
