"use strict";

const express = require("express");
const { body, query } = require("express-validator");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { BadRequestError, NotFoundError } = require("../errors");
const { Profile, Comment } = require("../model");
const { validateRequest, requireAuth } = require("../middlewares");
const { MBTI_LIST, ENNEAGRAM_LIST, ZODIAC_LIST } = require("../constants");

const router = express.Router();

router.post(
  "/:profileId/comments",
  requireAuth,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("mbti")
      .trim()
      .optional({ checkFalsy: true })
      .isIn(MBTI_LIST)
      .withMessage("Invalid MBTI"),
    body("enneagram")
      .trim()
      .optional({ checkFalsy: true })
      .isIn(ENNEAGRAM_LIST)
      .withMessage("Invalid Enneagram"),
    body("zodiac")
      .trim()
      .optional({ checkFalsy: true })
      .isIn(ZODIAC_LIST)
      .withMessage("Invalid Zodiac"),
  ],
  validateRequest,
  async (req, res) => {
    const { title, content, mbti, enneagram, zodiac } = req.body;
    const profile = await Profile.findById(
      mongoose.Types.ObjectId(req.params.profileId)
    );
    const user = await Profile.findById(mongoose.Types.ObjectId(req.user.id));

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    if (profile.id == user.id) {
      throw new BadRequestError("Cannot comment on your own profile");
    }

    const comment = Comment.build({
      commentTo: profile,
      commentBy: user,
      title,
      content,
      mbti,
      enneagram,
      zodiac,
    });
    await comment.save();

    res.status(201).send({
      message: "Comment successfully created",
      data: comment,
    });
  }
);

router.get(
  "/:profileId/comments",
  [
    query("filter")
      .trim()
      .optional({ checkFalsy: true })
      .isIn(["mbti", "enneagram", "zodiac"])
      .withMessage("Invalid filter params"),
    query("sort")
      .trim()
      .optional({ checkFalsy: true })
      .isIn(["recent", "best"])
      .withMessage("Invalid sort params"),
  ],
  validateRequest,
  async (req, res) => {
    const profile = await Profile.findById(
      mongoose.Types.ObjectId(req.params.profileId)
    );

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    const query = {
      commentTo: { $eq: profile.id },
    };
    const sort = {};

    if (req.query.filter) {
      query[req.query.filter] = { $nin: [null, ""] };
    }

    switch (req.query.sort) {
      case "best":
        sort.votes = -1;
        break;
      case "recent":
      default:
        sort.createdAt = -1;
        break;
    }

    console.log("query", query);
    console.log("sort", sort);
    const comments = await Comment.find(query).sort(sort).populate("commentBy");

    res.status(200).send({
      message: "Fetch Comments successfully",
      data: comments,
    });
  }
);

router.post("/:profileId/comments/:id/like", requireAuth, async (req, res) => {
  const comment = await Comment.findById(
    mongoose.Types.ObjectId(req.params.id)
  );

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  if (comment.votes.indexOf(req.user.id) !== -1) {
    throw new BadRequestError("Already voted this comment");
  }

  comment.votes.push(mongoose.Types.ObjectId(req.user.id));
  await comment.save();

  res.status(200).send({
    message: "Successfully like comment",
    data: comment.votes.length,
  });
});

router.post(
  "/:profileId/comments/:id/dislike",
  requireAuth,
  async (req, res) => {
    const comment = await Comment.findById(
      mongoose.Types.ObjectId(req.params.id)
    );

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    if (comment.votes.indexOf(req.user.id) === -1) {
      throw new BadRequestError("You're not voted this comment");
    }

    comment.votes.pull(mongoose.Types.ObjectId(req.user.id));
    await comment.save();

    res.status(200).send({
      message: "Successfully dislike comment",
      data: comment.votes.length,
    });
  }
);

module.exports = router;
