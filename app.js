"use strict";

const express = require("express");
require("express-async-errors");
const { json } = require("body-parser");

const { NotFoundError } = require("./errors");
const { errorHandler } = require("./middlewares");

const app = express();

app.use(json());

// set the view engine to ejs
app.set("view engine", "ejs");

app.use("/", require("./routes/profile")());

app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

module.exports = { app };
