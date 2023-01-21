"use strict";

const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    // username just for login
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mbti: {
      type: String,
      required: true,
    },
    enneagram: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    tritype: {
      type: Number,
      required: true,
    },
    socionics: {
      type: String,
      required: true,
    },
    sloan: {
      type: String,
      required: true,
    },
    psyche: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
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

ProfileSchema.statics.build = (attrs) => {
  return new Profile(attrs);
};

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
