// 'use strict';

// const express = require('express');
// const app = express();
// const port =  process.env.PORT || 3000;

// // set the view engine to ejs
// app.set('view engine', 'ejs');

// // routes
// app.use('/', require('./routes/profile')());

// // start server
// const server = app.listen(port);
// console.log('Express started. Listening on %s', port);

"use strict";

const mongoose = require("mongoose");
const { app } = require("./app");

const start = async () => {
  // check env variables
  //   if (!process.env.JWT_KEY) {
  //     throw new Error("JWT_KEY must be defined");
  //   }
  //   if (!process.env.MONGO_URI) {
  //     throw new Error("MONGO_URI must be defined");
  //   }

  const port = process.env.PORT || 3000;

  try {
    mongoose.set("strictQuery", false); // mongoose v7
    await mongoose.connect("mongodb://mongo:27017/booworld");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(port, () => {
    console.log("Express started. Listening on %s", port);
  });
};

start();
