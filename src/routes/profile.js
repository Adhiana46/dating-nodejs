"use strict";

const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { BadRequestError, NotFoundError } = require("../errors");
const { Profile } = require("../model");
const { validateRequest } = require("../middlewares");
const { MBTI_LIST, ENNEAGRAM_LIST } = require("../constants");

const router = express.Router();

router.post(
  "/",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("mbti")
      .trim()
      .notEmpty()
      .withMessage("MBTI is required")
      .isIn(MBTI_LIST)
      .withMessage("Invalid MBTI"),
    body("enneagram")
      .trim()
      .notEmpty()
      .withMessage("Enneagram is required")
      .isIn(ENNEAGRAM_LIST)
      .withMessage("Invalid Enneagram"),
    body("variant").trim().notEmpty().withMessage("Variant is required"),
    body("tritype")
      .trim()
      .notEmpty()
      .withMessage("Tritype is required")
      .isNumeric()
      .withMessage("Tritype must be number"),
    body("socionics").trim().notEmpty().withMessage("Socionics is required"),
    body("sloan").trim().notEmpty().withMessage("Sloan is required"),
    body("psyche").trim().notEmpty().withMessage("Psyche is required"),
    body("image").trim().notEmpty().withMessage("Image is required"),
  ],
  validateRequest,
  async (req, res) => {
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
  }
);

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

  const query = {};
  if (ids.length > 0) {
    query._id = { $in: ids };
  }

  const profiles = await Profile.find(query);

  return res.status(200).send({
    message: "Fetch Profile successfully",
    data: profiles,
  });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const profile = await Profile.findById(mongoose.Types.ObjectId(id.trim()));

  if (!profile) {
    throw new NotFoundError();
  }

  return res.status(200).send({
    message: "Get Profile successfully",
    data: profile,
  });
});

router.post(
  "/signin",
  [body("username").trim().notEmpty().withMessage("Username is required")],
  validateRequest,
  async (req, res) => {
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
  }
);

module.exports = router;
