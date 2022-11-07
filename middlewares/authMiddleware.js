const CustomError = require("../errors/index");
const jwt = require("../utils/index");

const authUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.BadRequestError("Authentication failed!");
  }
  const decoded = jwt.verifyToken(token);
  req.user = { userId: decoded.userId, name: decoded.name, role: decoded.role };
  next();
};

const authPerms = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this resource!"
      );
    }
    next();
  };
};

module.exports = { authUser, authPerms };
