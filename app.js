"use strict";

const express = require("express");
require("express-async-errors");
const { json } = require("body-parser");

const { NotFoundError } = require("./errors");
const { errorHandler } = require("./middlewares");

const { ProfileRouter, CommentRouter } = require("./routes");

// const { Profile, Comment } = require("./model");

// (async () => {
//   const { mongoose } = require("mongoose");
//   const adhiana48 = await Profile.findById(
//     mongoose.Types.ObjectId("63c945421c81c344321f4623")
//   );
//   const adhiana46 = await Profile.findById(
//     mongoose.Types.ObjectId("63c9508d1a33d9a1c028c5da")
//   );

//   const comment1 = Comment.build({
//     profileId: adhiana48,
//     commentBy: adhiana46,
//     title: "Ini comment dari adhiana46",
//     content: "In eu id irure reprehenderit ea.",
//     mbti: "INTJ",
//     enneagram: null,
//     zodiac: null,
//   });
//   const comment2 = Comment.build({
//     profileId: adhiana48,
//     commentBy: adhiana46,
//     title: "Ini comment dari adhiana46 yang ke 2",
//     content:
//       "In eu id irure reprehenderit ea. Proident amet deserunt sit quis amet esse deserunt deserunt.",
//     mbti: "ESTJ",
//     enneagram: null,
//     zodiac: "Aries",
//   });

//   // await comment1.save();
//   // await comment2.save();

//   const comments = await Comment.find({})
//     .populate("profileId")
//     .populate("commentBy");
//   console.log(comments);
// })();

const app = express();

app.use(json());

app.use("/api/v1/profile", ProfileRouter);
app.use("/api/v1/profile", CommentRouter);

app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

module.exports = { app };
