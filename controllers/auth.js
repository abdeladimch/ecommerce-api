const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../errors");
const jwt = require("../utils/index");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new CustomError.BadRequestError(
      "Name, email and password fields cannot be empty!"
    );
  }
  const user = await User.create(req.body);
  const userToken = jwt.createToken(user);
  jwt.attachCookiesToRes(res, userToken);
  res.status(StatusCodes.CREATED).json(userToken);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Email and password fields cannot be empty!"
    );
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const userToken = jwt.createToken(user);
    jwt.attachCookiesToRes(res, userToken);
    return res.status(StatusCodes.OK).json(userToken);
  }
  throw new CustomError.UnauthenticatedError("Invalid credentials!");
};

const logout = async (req, res) => {
  res.cookie("token", "", { expires: new Date(Date.now()) });
  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};

module.exports = { signup, login, logout };
