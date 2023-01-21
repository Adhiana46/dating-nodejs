const jwt = require("jsonwebtoken");
const { NotAuthorizeError, BadRequestError } = require("../errors");

const requireAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new NotAuthorizeError();
  }

  const [type, token] = req.headers.authorization.split(" ");

  if (type != "Bearer") {
    throw new BadRequestError("Invalid Authorization header");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY || "secret");
    req.user = payload;
  } catch (err) {
    throw new NotAuthorizeError();
  }

  next();
};

module.exports = requireAuth;
