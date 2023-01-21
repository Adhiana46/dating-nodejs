const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const { app } = require("../app");
const jwt = require("jsonwebtoken");

let mongo;

beforeAll(async () => {
  process.env.JWT_KEY = "secret";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  mongoose.set("strictQuery", false); // prepare for mongoose v7
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async (username) => {
  const response = await request(app)
    .post("/api/v1/profile/signin")
    .send({
      username,
    })
    .expect(200);

  return response.body.data;
};

global.createRandomProfile = async () => {
  const randomUsername = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .post("/api/v1/profile")
    .send({
      username: randomUsername,
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

global.createRandomComment = async (commentTo, commentBy, values) => {
  const randomTitle = new mongoose.Types.ObjectId().toHexString();

  const token = await signin(commentBy.username);

  const response = await request(app)
    .post(`/api/v1/profile/${commentTo.id}/comments`)
    .set("Authorization", "Bearer " + token)
    .send({
      title: values.title || randomTitle,
      content:
        values.content ||
        "Ex excepteur incididunt veniam sunt consectetur adipisicing amet duis adipisicing incididunt consectetur duis ullamco mollit. In do officia incididunt est Lorem nulla laborum cupidatat. Ut enim sunt nisi qui voluptate quis voluptate irure nulla do veniam incididunt. Laboris duis velit laboris dolor duis irure ea labore proident eiusmod. Anim irure commodo non et duis ad laboris cupidatat sint nulla. Aliqua cupidatat ad eu anim laboris aute enim aliqua in adipisicing aliqua et.",
      mbti: values.mbti,
      enneagram: values.enneagram,
      zodiac: values.zodiac,
    })
    .expect(201);

  return response.body.data;
};
