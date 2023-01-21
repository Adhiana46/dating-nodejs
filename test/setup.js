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
  const id = new mongoose.Types.ObjectId().toHexString();

  // Build a JWT payload. { id, username }
  const payload = {
    id: id,
    username: username,
  };

  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY);

  // Build a session object, {jwt: eydsakdljaiorer }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return base64;
};
