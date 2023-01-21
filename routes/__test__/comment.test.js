const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../app");

//// POST /api/v1/profile/:profile_id/comments
it("return 401 if user is not signin", async () => {
  const profileId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/v1/profile/${profileId}/comments`)
    .send({})
    .expect(401);
});

it("return 400 if not pass validation", async () => {
  const profile = await createRandomProfile();
  const token = await signin(profile.username);

  // Invalid title
  await request(app)
    .post(`/api/v1/profile/${profile.id}/comments`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "",
      content:
        "Ex excepteur incididunt veniam sunt consectetur adipisicing amet duis adipisicing incididunt consectetur duis ullamco mollit. In do officia incididunt est Lorem nulla laborum cupidatat. Ut enim sunt nisi qui voluptate quis voluptate irure nulla do veniam incididunt. Laboris duis velit laboris dolor duis irure ea labore proident eiusmod. Anim irure commodo non et duis ad laboris cupidatat sint nulla. Aliqua cupidatat ad eu anim laboris aute enim aliqua in adipisicing aliqua et.",
      mbti: null,
      enneagram: "9w1",
      zodiac: null,
    })
    .expect(400);

  // invalid content
  await request(app)
    .post(`/api/v1/profile/${profile.id}/comments`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Cinta Sampai Mati",
      content: "",
      mbti: null,
      enneagram: "9w1",
      zodiac: null,
    })
    .expect(400);

  // invalid mbti
  await request(app)
    .post(`/api/v1/profile/${profile.id}/comments`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Cinta Sampai Mati",
      content:
        "Ex excepteur incididunt veniam sunt consectetur adipisicing amet duis adipisicing incididunt consectetur duis ullamco mollit. In do officia incididunt est Lorem nulla laborum cupidatat. Ut enim sunt nisi qui voluptate quis voluptate irure nulla do veniam incididunt. Laboris duis velit laboris dolor duis irure ea labore proident eiusmod. Anim irure commodo non et duis ad laboris cupidatat sint nulla. Aliqua cupidatat ad eu anim laboris aute enim aliqua in adipisicing aliqua et.",
      mbti: "xxxx",
      enneagram: "9w1",
      zodiac: null,
    })
    .expect(400);

  // invalid enneagram
  await request(app)
    .post(`/api/v1/profile/${profile.id}/comments`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Cinta Sampai Mati",
      content:
        "Ex excepteur incididunt veniam sunt consectetur adipisicing amet duis adipisicing incididunt consectetur duis ullamco mollit. In do officia incididunt est Lorem nulla laborum cupidatat. Ut enim sunt nisi qui voluptate quis voluptate irure nulla do veniam incididunt. Laboris duis velit laboris dolor duis irure ea labore proident eiusmod. Anim irure commodo non et duis ad laboris cupidatat sint nulla. Aliqua cupidatat ad eu anim laboris aute enim aliqua in adipisicing aliqua et.",
      mbti: null,
      enneagram: "xxxx",
      zodiac: null,
    })
    .expect(400);

  // invalid zodiac
  await request(app)
    .post(`/api/v1/profile/${profile.id}/comments`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Cinta Sampai Mati",
      content:
        "Ex excepteur incididunt veniam sunt consectetur adipisicing amet duis adipisicing incididunt consectetur duis ullamco mollit. In do officia incididunt est Lorem nulla laborum cupidatat. Ut enim sunt nisi qui voluptate quis voluptate irure nulla do veniam incididunt. Laboris duis velit laboris dolor duis irure ea labore proident eiusmod. Anim irure commodo non et duis ad laboris cupidatat sint nulla. Aliqua cupidatat ad eu anim laboris aute enim aliqua in adipisicing aliqua et.",
      mbti: null,
      enneagram: "9w1",
      zodiac: "januari",
    })
    .expect(400);
});

it("return 404 if profile is not found", async () => {
  const profileId = new mongoose.Types.ObjectId().toHexString(); // random invalid profile (not-found)
  const profile = await createRandomProfile();
  const token = await signin(profile.username);

  await request(app)
    .post(`/api/v1/profile/${profileId}/comments`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "This is title",
      content:
        "Ex excepteur incididunt veniam sunt consectetur adipisicing amet duis adipisicing incididunt consectetur duis ullamco mollit. In do officia incididunt est Lorem nulla laborum cupidatat. Ut enim sunt nisi qui voluptate quis voluptate irure nulla do veniam incididunt. Laboris duis velit laboris dolor duis irure ea labore proident eiusmod. Anim irure commodo non et duis ad laboris cupidatat sint nulla. Aliqua cupidatat ad eu anim laboris aute enim aliqua in adipisicing aliqua et.",
      mbti: null,
      enneagram: "9w1",
      zodiac: null,
    })
    .expect(404);
});

it("return 400 if user is commenting his own profile", async () => {
  const profile = await createRandomProfile();
  const token = await signin(profile.username);

  await request(app)
    .post(`/api/v1/profile/${profile.id}/comments`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "This is title",
      content:
        "Ex excepteur incididunt veniam sunt consectetur adipisicing amet duis adipisicing incididunt consectetur duis ullamco mollit. In do officia incididunt est Lorem nulla laborum cupidatat. Ut enim sunt nisi qui voluptate quis voluptate irure nulla do veniam incididunt. Laboris duis velit laboris dolor duis irure ea labore proident eiusmod. Anim irure commodo non et duis ad laboris cupidatat sint nulla. Aliqua cupidatat ad eu anim laboris aute enim aliqua in adipisicing aliqua et.",
      mbti: null,
      enneagram: "9w1",
      zodiac: null,
    })
    .expect(400);
});

it("return 201 if valid input is provided", async () => {
  const profile = await createRandomProfile();
  const profileTarget = await createRandomProfile();
  const token = await signin(profile.username);

  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "This is title",
      content:
        "Ex excepteur incididunt veniam sunt consectetur adipisicing amet duis adipisicing incididunt consectetur duis ullamco mollit. In do officia incididunt est Lorem nulla laborum cupidatat. Ut enim sunt nisi qui voluptate quis voluptate irure nulla do veniam incididunt. Laboris duis velit laboris dolor duis irure ea labore proident eiusmod. Anim irure commodo non et duis ad laboris cupidatat sint nulla. Aliqua cupidatat ad eu anim laboris aute enim aliqua in adipisicing aliqua et.",
      mbti: null,
      enneagram: "9w1",
      zodiac: null,
    })
    .expect(201);
});

//// GET /api/v1/profile/:profile_id/comments/:comment_id
it("return 404 if comment is not found", async () => {
  const profile = await createRandomProfile();
  const invalidId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/v1/profile/${invalidId}/comments/${invalidId}`)
    .send({})
    .expect(404);
});

it("return 200 if comment is exists", async () => {
  const profile = await createRandomProfile();
  const profileTarget = await createRandomProfile();

  const comment = await createRandomComment(profileTarget, profile, {});

  await request(app)
    .get(`/api/v1/profile/${profileTarget.id}/comments/${comment.id}`)
    .send({})
    .expect(200);
});

//// POST /api/v1/profile/:profile_id/comments/:comment_id/like
it("return 401 if user is not authenticated", async () => {
  const profile = await createRandomProfile();
  const profileTarget = await createRandomProfile();

  const comment = await createRandomComment(profileTarget, profile, {});

  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment.id}/like`)
    .send({})
    .expect(401);
});

it("return 400 if user already like the comment", async () => {
  const profile = await createRandomProfile();
  const profileTarget = await createRandomProfile();
  const token = await signin(profile.username);

  const comment = await createRandomComment(profileTarget, profile, {});

  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment.id}/like`)
    .set("Authorization", `Bearer ${token}`)
    .send({})
    .expect(200);

  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment.id}/like`)
    .set("Authorization", `Bearer ${token}`)
    .send({})
    .expect(400);
});

it("return 200 if user like the comment", async () => {
  const profile = await createRandomProfile();
  const profileTarget = await createRandomProfile();
  const token = await signin(profile.username);

  const comment = await createRandomComment(profileTarget, profile, {});

  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment.id}/like`)
    .set("Authorization", `Bearer ${token}`)
    .send({})
    .expect(200);
});

//// POST /api/v1/profile/:profile_id/comments/:comment_id/dislike
it("return 401 if user is not authenticated", async () => {
  const profile = await createRandomProfile();
  const profileTarget = await createRandomProfile();

  const comment = await createRandomComment(profileTarget, profile, {});

  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment.id}/dislike`)
    .send({})
    .expect(401);
});

it("return 400 if user already like the comment", async () => {
  const profile = await createRandomProfile();
  const profileTarget = await createRandomProfile();
  const token = await signin(profile.username);

  const comment = await createRandomComment(profileTarget, profile, {});

  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment.id}/dislike`)
    .set("Authorization", `Bearer ${token}`)
    .send({})
    .expect(400);
});

it("return 200 if user like the comment", async () => {
  const profile = await createRandomProfile();
  const profileTarget = await createRandomProfile();
  const token = await signin(profile.username);

  const comment = await createRandomComment(profileTarget, profile, {});

  // first user should like the comment, then dislike
  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment.id}/like`)
    .set("Authorization", `Bearer ${token}`)
    .send({})
    .expect(200);

  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment.id}/dislike`)
    .set("Authorization", `Bearer ${token}`)
    .send({})
    .expect(200);
});

//// GET /api/v1/profile/:profile_id/comments
it("return 404 if target profile is not exists", async () => {
  const invalidId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/v1/profile/${invalidId}/comments`)
    .send({})
    .expect(404);
});

it("return 200 with valid response that are sorted and filtered", async () => {
  const profile = await createRandomProfile();
  const profileTarget = await createRandomProfile();
  const profile2 = await createRandomProfile();

  const tokenProfile = await signin(profile.username);
  const tokenProfile2 = await signin(profile2.username);

  const comment1 = await createRandomComment(profileTarget, profile, {
    mbti: "INTJ",
    enneagram: "3w2",
    zodiac: "Aries",
  });
  const comment2 = await createRandomComment(profileTarget, profile, {
    mbti: "ISTJ",
    enneagram: "3w2",
    zodiac: "Aries",
  });
  const comment3 = await createRandomComment(profileTarget, profile, {
    mbti: "ESTJ",
    enneagram: "",
    zodiac: "",
  });
  const comment4 = await createRandomComment(profileTarget, profile, {
    mbti: "",
    enneagram: "3w2",
    zodiac: "",
  });
  const comment5 = await createRandomComment(profileTarget, profile, {
    mbti: "",
    enneagram: "",
    zodiac: "Cancer",
  });
  const comment6 = await createRandomComment(profileTarget, profile, {
    mbti: "",
    enneagram: "",
    zodiac: "",
  });

  // Like comments
  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment3.id}/like`)
    .set("Authorization", `Bearer ${tokenProfile}`)
    .send({})
    .expect(200);
  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment3.id}/like`)
    .set("Authorization", `Bearer ${tokenProfile2}`)
    .send({})
    .expect(200);

  await request(app)
    .post(`/api/v1/profile/${profileTarget.id}/comments/${comment4.id}/like`)
    .set("Authorization", `Bearer ${tokenProfile2}`)
    .send({})
    .expect(200);

  // sort= and filter=
  // should return all comment sorted by most recent (default)
  const response1 = await request(app)
    .get(`/api/v1/profile/${profileTarget.id}/comments?sort=&filter=`)
    .send({})
    .expect(200);

  const data1 = response1.body.data;

  expect(data1.length).toEqual(6);
  expect(data1[0].id).toEqual(comment6.id);
  expect(data1[1].id).toEqual(comment5.id);
  expect(data1[2].id).toEqual(comment4.id);
  expect(data1[3].id).toEqual(comment3.id);
  expect(data1[4].id).toEqual(comment2.id);
  expect(data1[5].id).toEqual(comment1.id);

  // sort=recent and filter=
  // should return all comment sorted by most recent
  const response2 = await request(app)
    .get(`/api/v1/profile/${profileTarget.id}/comments?sort=recent&filter=`)
    .send({})
    .expect(200);

  const data2 = response2.body.data;

  expect(data2.length).toEqual(6);
  expect(data2[0].id).toEqual(comment6.id);
  expect(data2[1].id).toEqual(comment5.id);
  expect(data2[2].id).toEqual(comment4.id);
  expect(data2[3].id).toEqual(comment3.id);
  expect(data2[4].id).toEqual(comment2.id);
  expect(data2[5].id).toEqual(comment1.id);

  // sort=recent and filter=mbti
  // should return all comment that have mbti sorted by most recent
  const response3 = await request(app)
    .get(`/api/v1/profile/${profileTarget.id}/comments?sort=recent&filter=mbti`)
    .send({})
    .expect(200);

  const data3 = response3.body.data;

  expect(data3.length).toEqual(3);
  expect(data3[0].id).toEqual(comment3.id);
  expect(data3[1].id).toEqual(comment2.id);
  expect(data3[2].id).toEqual(comment1.id);

  // sort=recent and filter=enneagram
  // should return all comment that have enneagram sorted by most recent
  const response4 = await request(app)
    .get(
      `/api/v1/profile/${profileTarget.id}/comments?sort=recent&filter=enneagram`
    )
    .send({})
    .expect(200);

  const data4 = response4.body.data;

  expect(data4.length).toEqual(3);
  expect(data4[0].id).toEqual(comment4.id);
  expect(data4[1].id).toEqual(comment2.id);
  expect(data4[2].id).toEqual(comment1.id);

  // sort=recent and filter=zodiac
  // should return all comment that have zodiac sorted by most recent
  const response5 = await request(app)
    .get(
      `/api/v1/profile/${profileTarget.id}/comments?sort=recent&filter=zodiac`
    )
    .send({})
    .expect(200);

  const data5 = response5.body.data;

  expect(data5.length).toEqual(3);
  expect(data5[0].id).toEqual(comment5.id);
  expect(data5[1].id).toEqual(comment2.id);
  expect(data5[2].id).toEqual(comment1.id);

  // sort=best and filter=
  // should return all comment sorted by most voted
  const response6 = await request(app)
    .get(`/api/v1/profile/${profileTarget.id}/comments?sort=best&filter=`)
    .send({})
    .expect(200);

  const data6 = response6.body.data;

  expect(data6.length).toEqual(6);
  expect(data6[0].id).toEqual(comment3.id);
  expect(data6[1].id).toEqual(comment4.id);
});
