"use strict";

const CustomError = require("./custom-error");

class NotFoundError extends CustomError {
  constructor() {
    super("NotFoundError");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  statusCode() {
    return 404;
  }
  serializeError() {
    return [{ message: "Not Found" }];
  }
}

module.exports = NotFoundError;
