const BadRequestError = require("./badRequest");
const UnauthenticatedError = require("./unauthenticated");
const UnauthorizedError = require("./unauthorized");
const NotFoundError = require("./notFound");

module.exports = {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
  NotFoundError,
};
