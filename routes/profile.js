"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { BadRequestError } = require("../errors");
const { Profile } = require("../model");

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    username,
    name,
    description,
    mbti,
    enneagram,
    variant,
    tritype,
    socionics,
    sloan,
    psyche,
    image,
  } = req.body;

  // check if username is already exists
  const existingProfile = await Profile.findOne({ username });
  console.log(existingProfile);
  if (existingProfile) {
    throw new BadRequestError("Username already in use");
  }

  // Store profile data
  const profile = Profile.build({
    username,
    name,
    description,
    mbti,
    enneagram,
    variant,
    tritype,
    socionics,
    sloan,
    psyche,
    image,
  });
  await profile.save();

  res.status(201).send({
    message: "Profile successfully created",
    data: profile,
  });
});

router.get("/", async (req, res) => {
  const rawIds = req.query.ids;
  const ids = [];

  if (rawIds) {
    const tempIds = rawIds.split(",");
    for (let id of tempIds) {
      try {
        ids.push(mongoose.Types.ObjectId(id.trim()));
      } catch (err) {
        throw new BadRequestError("Invalid ids parameter");
      }
    }
  }

  let profiles = [];
  if (ids.length > 0) {
    profiles = await Profile.find({ _id: { $in: ids } });
  } else {
    profiles = await Profile.find({});
  }

  return res.status(200).send({
    message: "Fetch Profile successfully",
    data: profiles,
  });
});

router.post("/signin", async (req, res) => {
  const { username } = req.body;

  // check if profile with username exists
  const profile = await Profile.findOne({ username });

  if (!profile) {
    throw new BadRequestError("Invalid Profile");
  }

  // generate JWT
  const jwtToken = jwt.sign(
    {
      id: profile.id,
      username: profile.username,
    },
    process.env.JWT_KEY || "secret"
  );

  return res.status(200).send({
    message: "Signin successfully",
    data: jwtToken,
  });
});

module.exports = router;
