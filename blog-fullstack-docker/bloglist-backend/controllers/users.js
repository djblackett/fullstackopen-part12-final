const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// todo id or username for routing?

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 });
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  if (!user) {
    response.status(404).send({ error: "User not found" });
    return;
  }
  response.json(user);
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  const usernameResult = await User.find({ username: body.username });
  if (usernameResult.length > 0) {
    response.status(400).send({ error: "Username is already taken" });
    return;
  }

  const username = body.username;
  const password = body.password;

  if (!username || username.length < 3) {
    response.status(400).send({ error: "username is required and must be at least 3 characters" });
    return;
  }

  if (!password || password.length < 3) {
    response.status(400).send({ error: "password is required and must be at least 3 characters" });
    return;
  }

  const userObj = {
    name: body.name,
    username: body.username,
  };

  bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(password, salt, async function (err, hash) {
      //Store hash in your password DB.

      userObj.passwordHash = hash;

      const user = new User(userObj);
      const result = await user.save();
      response.status(201).json(result);
    });
  });
});

usersRouter.delete("/:id", async (request, response) => {
  const id = String(request.params.id);
  await User.findByIdAndRemove({ _id: String(id) });
  response.status(204).end();

});

usersRouter.put("/:id", async (request, response) => {
  const id = String(request.params.id);
  const body = request.body;

  const result = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: "query" });

  if (result) {
    response.json(result);
  } else {
    response.sendStatus(404);
  }

});


module.exports = usersRouter;

