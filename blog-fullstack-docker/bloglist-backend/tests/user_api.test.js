const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const api = supertest(app);

const initialUsers = [
  { name: "Bob",
    username: "bobthedude22",
    password: "notagoodpassword"
  },
  { name: "Reggie",
    username: "reggiethedude",
    password: "notagoodpasswordeither"
  },
];

const usersWithHash = [{ ...initialUsers[0] }, { ...initialUsers[1] }];

beforeEach(async () => {

  await User.deleteMany({});

  const user1Hash = await bcrypt.hash(initialUsers[0].password, 10);
  const user2Hash = await bcrypt.hash(initialUsers[1].password, 10);

  usersWithHash[0].passwordHash = user1Hash;
  delete usersWithHash[0].password;
  usersWithHash[1].passwordHash = user2Hash;
  delete usersWithHash[1].password;

  const userObjects = usersWithHash.map(user => new User(user));
  const promiseArray = userObjects.map(user => user.save());
  await Promise.all(promiseArray);
}, 100000);


describe("testing user database", () => {

  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);


  test("two users are returned", async () => {
    const response = await api.get("/api/users");
    expect(200);
    expect(response.body).toHaveLength(initialUsers.length);
  });
});


describe("adds a valid formatted user to database", () => {

  test("id property exists", async () => {
    const response = await api.get("/api/users");
    const user = response.body[0];
    expect(user.id).toBeDefined();
  });


  test("successfully adds one user to database", async () => {
    const sample = {
      name: "Mr. Anderson",
      username: "Neo",
      password: "iAmTheOne"
    };

    const postResult = await api.post("/api/users").send(sample);
    const getResult = await api.get("/api/users");

    expect(getResult.body).toHaveLength(3);
    expect(postResult.body.username).toBe(sample.username);
    expect(postResult.body.name).toBe(sample.name);
  });
});


describe("adding an invalid user returns proper error message", () => {
  test("missing username or password returns 400 bad request", async () => {
    const noUsername = {
      password: "iLiveInATree"
    };

    const noPassword = {
      username: "Neo"
    };

    await api.post("/api/users").send(noUsername).expect(400);
    await api.post("/api/users").send(noPassword).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});