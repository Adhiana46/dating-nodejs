const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../app");
const { Profile } = require("../../model");

const createRandomProfile = async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .post("/api/v1/profile")
    .send({
      username: id, // random
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(201);

  return response.body.data;
};

//// POST /api/v1/profile

it("return 400 if not pass validation", async () => {
  // invalid username
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);

  // Invalid name
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);

  // Invalid description
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);

  // Invalid mbti
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);

  // Invalid enneagram
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);

  // Invalid variant
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);

  // Invalid tritype
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: "should-be-number",
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);

  // Invalid socionics
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);

  // Invalid sloan
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);

  // Invalid psyche
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);

  // Invalid image
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "",
    })
    .expect(400);
});

it("return 400 if username already use", async () => {
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(201);

  // invalid, because already used
  await request(app)
    .post("/api/v1/profile")
    .send({
      username: "mark",
      name: "Mark Paquis",
      description: "Adolph Larrue Martinez III.",
      mbti: "INTJ",
      enneagram: "9w1",
      variant: "sp/so",
      tritype: 725,
      socionics: "SEE",
      sloan: "RCOEN",
      psyche: "FEVL",
      image: "https://soulverse.boo.world/images/1.png",
    })
    .expect(400);
});

it("return 200 if inputs is valid", async () => {
  const username = "mark";
  const name = "Mark";
  const description = "Adolph Larrue Martinez III.";
  const mbti = "INTJ";
  const enneagram = "9w1";
  const variant = "sp/so";
  const tritype = 725;
  const socionics = "SEE";
  const sloan = "RCOEN";
  const psyche = "FEVL";
  const image = "https://soulverse.boo.world/images/1.png";

  const response = await request(app)
    .post("/api/v1/profile")
    .send({
      username: username,
      name: name,
      description: description,
      mbti: mbti,
      enneagram: enneagram,
      variant: variant,
      tritype: tritype,
      socionics: socionics,
      sloan: sloan,
      psyche: psyche,
      image: image,
    })
    .expect(201);

  const data = response.body.data;
  expect(data.username).toEqual(username);
  expect(data.name).toEqual(name);
  expect(data.description).toEqual(description);
  expect(data.mbti).toEqual(mbti);
  expect(data.enneagram).toEqual(enneagram);
  expect(data.variant).toEqual(variant);
  expect(data.tritype).toEqual(tritype);
  expect(data.socionics).toEqual(socionics);
  expect(data.sloan).toEqual(sloan);
  expect(data.psyche).toEqual(psyche);
  expect(data.image).toEqual(image);
});

//// GET /api/v1/profile?ids=:ids
it("return 400 if ids parameter is invalid", async () => {
  const invalidIds = ["abc"];

  await request(app)
    .get("/api/v1/profile")
    .query({ ids: invalidIds.join(",") })
    .send({})
    .expect(400);
});

it("return 200 with valid length", async () => {
  const profile1 = await createRandomProfile();
  const profile2 = await createRandomProfile(); // exclude
  const profile3 = await createRandomProfile();

  const response = await request(app)
    .get("/api/v1/profile")
    .query({ ids: [profile1.id, profile3.id].join(",") })
    .send({})
    .expect(200);

  expect(response.body.data.length).toEqual(2);
});

//// GET /api/v1/profile/:id
it("return 404 if profile is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get("/api/v1/profile/" + id)
    .send({})
    .expect(404);
});

it("return 200 if profile exists", async () => {
  const profile = await createRandomProfile();

  const response = await request(app)
    .get("/api/v1/profile/" + profile.id)
    .send({})
    .expect(200);

  const data = response.body.data;
  expect(data.username).toEqual(profile.username);
  expect(data.name).toEqual(profile.name);
  expect(data.description).toEqual(profile.description);
  expect(data.mbti).toEqual(profile.mbti);
  expect(data.enneagram).toEqual(profile.enneagram);
  expect(data.variant).toEqual(profile.variant);
  expect(data.tritype).toEqual(profile.tritype);
  expect(data.socionics).toEqual(profile.socionics);
  expect(data.sloan).toEqual(profile.sloan);
  expect(data.psyche).toEqual(profile.psyche);
  expect(data.image).toEqual(profile.image);
});

//// POST /api/v1/profile/signin
it("return 400 if invalid credential is provided", async () => {
  await request(app)
    .post("/api/v1/profile/signin")
    .send({
      username: "not-exists",
    })
    .expect(400);
});

it("return 200 if valid credential is provided", async () => {
  const profile = await createRandomProfile();

  await request(app)
    .post("/api/v1/profile/signin")
    .send({
      username: profile.username,
    })
    .expect(200);
});
