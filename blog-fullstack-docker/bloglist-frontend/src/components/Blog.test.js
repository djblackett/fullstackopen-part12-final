import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import CreateBlog from "./CreateBlog";



const userMock = {
  name: "test",
  username: "test",
  id: "29039e8fn39"
};

const blog = {
  title: "title",
  author: "Mr Author",
  url: "https://superduperblog.com",
  user: "id20004948#jf",
  likes: 100,
  id: "jurhbvnveu7w",
};

test("renders content", () => {

  const mockHandler = jest.fn();

  render(<Blog blog={blog} handleLikeButton={mockHandler} removeBlogFrontend={mockHandler} user={userMock} />);
  const title = screen.getByText(blog.title);
  const author = screen.getByText(blog.author);
  const div = screen.queryByText(blog.url);
  const likesDiv = screen.queryByText(blog.likes);

  expect(title).toBeDefined();
  expect(author).toBeDefined();
  expect(div).not.toBeInTheDocument();
  expect(likesDiv).not.toBeInTheDocument();
});

test("clicking view shows the full blog info", async () => {
  const mockHandler = jest.fn();
  render(<Blog blog={blog} removeBlogFrontend={mockHandler} user={userMock}  handleLikeButton={mockHandler}/>);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const url = screen.queryByText(blog.url);
  const likes =  screen.queryByText(blog.likes);

  expect(url).toBeDefined();
  expect(likes).toBeDefined();
});


test("clicking like button twice calls update function twice", async () => {
  const mockHandler = jest.fn();
  const mockRemove = jest.fn();

  render(<Blog blog={blog} handleLikeButton={mockHandler} removeBlogFrontend={mockRemove} user={userMock} />);

  const user = userEvent.setup();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const button = screen.getByText("like");
  // screen.debug(button);
  await user.click(button);
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});

test("add blog", async () => {

  const user = userEvent.setup();
  const handleCreate = jest.fn();
  const setSuccessMessage = jest.fn();

  render(<CreateBlog user={userMock} setSuccessMessage={setSuccessMessage} handleCreate={handleCreate} />);

  const title = screen.getByPlaceholderText("title");
  const author = screen.getByPlaceholderText("author");
  const url = screen.getByPlaceholderText("url");
  const submitButton = screen.getByText("create");

  const newBlog = {
    title: "this is my title",
    author: "I am the author",
    url:  "http://urltothesite.com"
  };

  await user.type(title, newBlog.title);
  await user.type(author, newBlog.author);
  await user.type(url, newBlog.url);
  await  user.click(submitButton);

  expect(handleCreate.mock.calls).toHaveLength(1);
  expect(handleCreate.mock.calls[0][0].title).toBe(newBlog.title);
  expect(handleCreate.mock.calls[0][0].author).toBe(newBlog.author);
  expect(handleCreate.mock.calls[0][0].url).toBe(newBlog.url);
  expect(handleCreate.mock.calls[0][0].user).toBe(userMock.id);
});
