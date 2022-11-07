const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (user) => {
  return { name: user.name, role: user.role, userId: user._id };
};

const genJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToRes = (res, cookieToken) => {
  const token = genJWT(cookieToken);
  const oneDay = 1000 * 3600 * 24;
  res.cookie("token", token, {
    expires: new Date(Date.now() + oneDay),
    signed: true,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
};

module.exports = { createToken, attachCookiesToRes, verifyToken };
