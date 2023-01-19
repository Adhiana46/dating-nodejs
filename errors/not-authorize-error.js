"use strict";

const CustomError = require("./custom-error");

class NotAuthorizeError extends CustomError {
  constructor() {
    super("NotAuthorizeError");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotAuthorizeError.prototype);
  }

  statusCode() {
    return 401;
  }
  serializeError() {
    return [{ message: "Not Authorized" }];
  }
}

module.exports = NotAuthorizeError;
