"use strict";

const CustomError = require("./custom-error");

class BadRequestError extends CustomError {
  constructor(message) {
    super(message);

    this.message = message;

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  statusCode() {
    return 400;
  }
  serializeError() {
    return [{ message: this.message }];
  }
}

module.exports = BadRequestError;
