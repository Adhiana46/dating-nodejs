const CustomError = require("./custom-error");

class RequestValidationError extends CustomError {
  constructor(errors) {
    super("RequestValidationError");

    this.errors = errors;

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  statusCode() {
    return 400;
  }

  serializeError() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}

module.exports = RequestValidationError;
