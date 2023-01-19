"use strict";

const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    commentTo: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    commentBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mbti: {
      type: String,
      required: false,
    },
    enneagram: {
      type: String,
      required: false,
    },
    zodiac: {
      type: String,
      required: false,
    },
    votes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Profile",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

CommentSchema.statics.build = (attrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
