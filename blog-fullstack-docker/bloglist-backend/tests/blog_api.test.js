const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const api = supertest.agent(app);
require("jest-expect-message");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");


const initialBlogs = [
  {
    title:"Blooog",
    author:"Me",
    url:"https://bloggityblogblog.org",
    likes:"200059"
  },
  {
    title:"The ultimate blog",
    author:"Mel Dude",
    url:"https://bloggityblogblog.org/testblog123",
    likes:"2244"
  },
];


const initialUser1 = {
  name: "Morpheus",
  username: "morphDude76",
  passwordHash: "password123"
};

const initialUser2 = {
  name: "Trinity",
  username: "trinitygal22",
  passwordHash: "password321"
};


let token1 = "";
let token2 = "";

beforeEach(async () => {

  await Blog.deleteMany({});
  await User.deleteMany({});

  // save 2 users to test DB
  const user1 = await new User(initialUser1).save();
  const user2 = await new User(initialUser2).save();

  // add user1 as the user field for each blog
  const userAdded = initialBlogs.map(blog => {
    return { ...blog, user: user1._id };
  });

  // save all blogs to test DB
  const blogObjects = userAdded.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);

  const userForToken1 = {
    username: user1.username,
    id: user1._id,
  };

  const userForToken2 = {
    username: user2.username,
    id: user2._id,
  };

  token1 = jwt.sign(userForToken1, SECRET);
  token2 = jwt.sign(userForToken2, SECRET);

  // add auth header to all requests
  api.auth(token1, { type: "bearer" });
}, 100000);


describe("When some initial blogs are already saved", () => {

  test("blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs");

    expect(response.status).toBe(200);
    expect("Content-Type", /application\/json/);
  }, 100000);

  test("two blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(200);
    expect(response.body).toHaveLength(initialBlogs.length);
  });

});

describe("adds a valid formatted blog to database", () => {

  test("id property exists", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    expect(blog.id).toBeDefined();
  });

  test("successfully adds one blog to database", async () => {
    const sample = {
      title: "I am a new blog being added to the database",
      url: "https://bloggityblogblog.org/supercooolblog",
      author: "angus"
    };

    const post = await api.post("/api/blogs").send(sample);
    const postResult = post.body;
    const getResult = await api.get("/api/blogs");

    expect(getResult.body).toHaveLength(3);
    expect(postResult.title).toBe(sample.title);
    expect(postResult.author).toBe(sample.author);
    expect(postResult.url).toBe(sample.url);
    expect(postResult.likes).toBe(0);
  });


  test("Adding a blog without likes value defaults to 0", async () => {

    const sample = {
      title:"I am a new blog being added to the database",
      url:"https://bloggityblogblog.org/supercooolblog"
    };

    const newBlog = await api.post("/api/blogs").send(sample);
    expect(newBlog.body.likes).toBe(0);
  });

});


describe("adding an invalid blog returns proper error message", () => {
  test("missing title or url returns 400 bad request", async () => {
    const noTitle = {
      url: "https://bloggityblogblog.org/supercooolblog"
    };

    const noUrl = {
      title: "I am a new blog being added to the database without a URL"
    };

    await api.post("/api/blogs").send(noTitle).expect(400);
    await api.post("/api/blogs").send(noUrl).expect(400);
  });

});

describe("successfully deletes a blog only if user is the blog's creator", () => {

  //
  test("successfully deletes a blog from DB", async () => {
    const getAllBlogs = await api.get("/api/blogs");
    const firstBlog = getAllBlogs.body[0];
    const firstBlogId = firstBlog.id;

    console.log(getAllBlogs.user);

    await api.delete(`/api/blogs/${firstBlogId}`);

    const blogsAfterDeletion = await api.get("/api/blogs");
    const blogUrls = blogsAfterDeletion.body.map(blog => blog.url);

    expect(204);
    expect(blogsAfterDeletion.body.length).toBe(initialBlogs.length - 1);
    expect(blogUrls).not.toContain(firstBlog.url);
  });

  test("cannot delete blog from another user", async() => {
    const getAllBlogs = await api.get("/api/blogs").set("Authorization", `bearer ${token2}`);
    const firstBlog = getAllBlogs.body[0];
    const firstBlogId = firstBlog.id;

    console.log(getAllBlogs.user);

    await api
      .delete(`/api/blogs/${firstBlogId}`)
      .set("Authorization", `bearer ${token2}`)
      .expect(401);

  }, 100000);
});


test("Successfully updates a blog", async () => {
  const getAllBlogs = await api.get("/api/blogs");
  const firstBlog = getAllBlogs.body[0];
  const firstBlogId = String(firstBlog.id);

  const updated = await api
    .put(`/api/blogs/${firstBlogId}`)
    .send({ title: firstBlog.title, url: firstBlog.url, author: firstBlog.author, likes: 12345678 }, { new: true });

  expect(updated.body.likes).toBe(12345678);
});

// This seems to be unnecessary due to part 5 allowing you to update anyone's blog (just the likes)
// test("Refuses to update other users' blog", async () => {
//   const getAllBlogs = await api.get("/api/blogs").set("Authorization", `bearer ${token2}`);
//   const firstBlog = getAllBlogs.body[0];
//   const firstBlogId = String(firstBlog.id);
//
//   const updated = await api
//     .put(`/api/blogs/${firstBlogId}`)
//     .set("Authorization", `bearer ${token2}`)
//     .send({ title: firstBlog.title, url: firstBlog.url, author: firstBlog.author, likes: 12345678 }, { new: true });
//
//   expect(updated.status).toBe(401);
// }, 100000);


afterAll(() => {
  mongoose.connection.close();
});