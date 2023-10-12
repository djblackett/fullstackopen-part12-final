import { useState } from "react";
import PropTypes from "prop-types";

function CreateBlog({ setSuccessMessage, handleCreate, user }) {

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleUrl = (e) => {
    setUrl(e.target.value);
  };

  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();

    const blogObj = {
      title: title,
      author: author,
      url: url,
      user: user.id,
    };

    handleCreate(blogObj);
    setSuccessMessage(`a new blog ${title} by ${author} added`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
    setTitle("");
    setAuthor("");
    setUrl("");


  };


  return <>
    <h2>Create new</h2>
    <form onSubmit={handleClick} style={{ display: "flex", flexDirection: "column", maxWidth: "25%" }}>
      <label>title</label>
      <input name="Title" value={title} onChange={handleTitle} type="text" placeholder="title" id="title"/>
      <label>author</label>
      <input name="Author" value={author} onChange={handleAuthor} type="text" placeholder="author" id="author"/>
      <label>url</label>
      <input name="Url" value={url} onChange={handleUrl} type="text" placeholder="url" id="url"/>
      <button type="submit" id="submit-blog">create</button>
    </form>
  </>;
}

export default CreateBlog;

CreateBlog.propTypes = {
  setSuccessMessage: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};