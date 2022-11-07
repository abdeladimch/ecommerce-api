const CustomError = require("../errors/index");

const checkPerms = (reqUser, resourceId) => {
  if (reqUser.role === "admin" || reqUser.userId === resourceId.toString())
    return;
  throw new CustomError.UnauthorizedError(
    "Unauthorized to access this resource!"
  );
};

module.exports = checkPerms;
