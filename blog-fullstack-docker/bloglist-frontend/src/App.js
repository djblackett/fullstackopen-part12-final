import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Toggleable from "./components/Toggleable";
import CreateBlog from "./components/CreateBlog";

// remove button only appears after refresh
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const createFormRef = useRef(null);

  useEffect(() => {

    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getBlogs();
    }
  }, [user]);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginService.login(username, password);
      const token = res.token;
      setUser(res);
      localStorage.setItem("user", JSON.stringify(res));

      setUsername("");
      setPassword("");

      blogService.setToken(token);

    } catch (error) {
      console.log(error);
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const getBlogs = async () => {
    const response = await blogService.getAll();
    // console.log(response);
    const sorted = sortBlogsByLikes(response);
    setBlogs(sorted);

  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  const handleCreate = async blogObject => {

    const response = await blogService.createBlog(blogObject);
    // console.log(response);
    if (response) {
      setBlogs(blogs.concat(response));
      createFormRef.current.toggleVisibility();
    }
  };

  const updateBlogFrontend = (id, updatedBlog) => {
    // console.log(id);
    // console.log(updatedBlog);
    const blogIndex = blogs.findIndex(blog => String(blog.id) === id);
    // console.log(blogIndex);
    const newArr = blogs.slice(0, blogIndex).concat(updatedBlog).concat(blogs.slice(blogIndex + 1));
    const sorted = sortBlogsByLikes(newArr);
    setBlogs(sorted);
  };

  const removeBlogFrontend = (id) => {
    const arr = [...blogs];
    const index = arr.findIndex(blog => blog.id === id);
    arr.splice(index, 1);
    setBlogs(arr);

  };

  const sortBlogsByLikes = (blogs) => {
    if (blogs) {
      const arr = [...blogs];
      arr.sort((a, b) => b.likes - a.likes);
      return arr;
    }
  };


  const handleLikeButton = async (blog) => {

    console.log(blog);

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      id: blog.id,
      likes: blog.likes + 1,
      user: blog.user.id ? blog.user.id : blog.user
    };

    const result = await blogService.updateBlog(updatedBlog.id, updatedBlog);
    console.log("result", result);

    if (result) {

      // this compensates for the fact that getAll returns blogs with the full user object as the user field
      // result.user = {
      //   id: blog.user.id,
      //   name: blog.user.name,
      //   username: blog.user.username
      // };
      console.log(result);
      updateBlogFrontend(result.id, result);
    }
  };

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to application</h2>
        <ErrorMessage message={errorMessage}/>
        <form onSubmit={handleLogin}>
          <label>username</label>
          <br/>
          <input type="text" value={username} name="Username" onChange={handleUsername} id="username" />
          <br/>
          <label>password</label>
          <br/>
          <input type="password" value={password} name="Password" onChange={handlePassword} id="password" />
          <br/>
          <button type="submit" id="login-button">login</button>
        </form>
      </div>
    );
  };

  const blogForm = () => {
    return (
      <div id="blog-form">

        <h2>blogs</h2>
        <SuccessMessage message={successMessage}/>
        <br/>
        {user.name} logged in
        <button onClick={logout} id="logout-button">logout</button>
        <br/>

        {/*{!isCreateVisible && <button onClick={toggleCreate}>new note</button>}*/}
        <Toggleable ref={createFormRef} buttonLabel="new blog" id="new-blog" >
          <CreateBlog blogs={blogs}
            setSuccessMessage={setSuccessMessage}
            setBlogs={setBlogs}
            handleCreate={handleCreate}
            user={user}

          />
        </Toggleable>
        <br/>
        {blogs.length > 0 && blogs.map(blog => {

          // console.log(blog);
          return <Blog key={blog.id} blog={blog} handleLikeButton={handleLikeButton} updateBlog={updateBlogFrontend} user={user} removeBlogFrontend={removeBlogFrontend}/>;
        }
        )}
      </div>
    );
  };

  return user === null ? loginForm() : blogForm();
};

export default App;

const SuccessMessage = ({ message }) => {
  if (!message) {
    return null;
  }
  return <p style={{ fontSize: 16, color: "green", padding: "5px", border: "3px solid green" }} id="login-success">{message}</p>;
};

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }
  return <p
    style={{
      fontSize: 16,
      color: "red",
      padding: "5px",
      border: "3px solid red",
      background: "white"
    }}
    id="login-error"
  >{message}</p>;
};