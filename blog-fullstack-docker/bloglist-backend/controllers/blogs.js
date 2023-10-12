const blogsRouter = require("express").Router();
const Blog = require("../models/blog");


blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.sendStatus(404);
  }
});

blogsRouter.post("/", async (request, response) => {

  const body = request.body;
  const user = request.user;
  console.log(user);

  const blogObj = {
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id.toString()
  };

  console.log(blogObj);

  console.log(typeof user.id);
  const blog = new Blog(blogObj);
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);

  await user.save();
  console.log(result);
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {

  const user = request.user;

  // this shouldn't be possible to do from the front end, but for the sake of backend testing...
  if (!user) {
    response.send({ error: "user not found" });
    return;
  }

  const id = String(request.params.id);
  const blog = await Blog.findById(id);

  console.log(blog.user);
  console.log(user.id);

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(String(id));
    response.status(204).end();
  } else {
    response.status(401).send({ error: "You can only delete your own blog posts" });
  }
});


blogsRouter.put("/:id", async (request, response) => {
  const id = String(request.params.id);
  const body = request.body;

  console.log("body from PUT request:");
  console.log(body);

  const result = await Blog.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    context: "query"
  });

  console.log(result);
  response.json(result);

});

module.exports = blogsRouter;