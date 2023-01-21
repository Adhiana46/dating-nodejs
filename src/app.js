"use strict";

const express = require("express");
require("express-async-errors");
const { json } = require("body-parser");

const { NotFoundError } = require("./errors");
const { errorHandler } = require("./middlewares");

const { ProfileRouter, CommentRouter } = require("./routes");

const app = express();

app.use(json());

app.use("/api/v1/profile", ProfileRouter);
app.use("/api/v1/profile", CommentRouter);

app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

module.exports = { app };
