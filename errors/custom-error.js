"use strict";

class CustomError extends Error {
  constructor() {
    super("CustomError");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  statusCode() {
    return 500;
  }
  serializeError() {
    return [{ message: "Something went wrong" }];
  }
}

module.exports = CustomError;
