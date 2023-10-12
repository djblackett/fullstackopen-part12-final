import { useEffect, useState } from "react";
import blogService from "../services/blogs";
import PropTypes from "prop-types";


// todo figure out what to do with the mismatch betweeen the return value from getAll vs everything else

const Blog = ({ blog, handleLikeButton, user, removeBlogFrontend }) => {

  const [viewFull, setViewFull] = useState(false);
  const [userId, setUserId] = useState("");
  const [userIsAuthor, setUserIsAuthor] = useState(String(blog.user.id) === String(user.id));

  useEffect(() => {
    if (typeof blog.user === "string") {
      setUserId(blog.user);
    } else {
      setUserId(blog.user.id);
    }
  });

  useEffect(() => {
    setUserIsAuthor(userId === String(user.id));
  }, );

  // console.log("blog.user.id: ", blog.user.id);
  // console.log("user.id: ", user.id);




  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.removeBlog(blog.id);
      removeBlogFrontend(blog.id);
    }
  };

  const handleClickLikeButton = () => {
    handleLikeButton(blog);
  };


  if (!blog) {
    return null;
  }

  // console.log("blog", blog);
  return (
    <div style={blogStyle} className="blog">
      <div className="blog-container">
        <span>{blog.title}</span> {blog.author}
        <button onClick={() => setViewFull(!viewFull)} className="view-button">{viewFull ? "hide" : "view"}</button>
        <br/>
        {viewFull && (
          <div className="full-view">
            {blog.url}
            <br/>
                        Likes {blog.likes}
            <br />
            Id {blog.id}
            <br />
            User: {userId}
            <button onClick={handleClickLikeButton} className="like-button">like</button>
            {userIsAuthor && <button onClick={handleRemove} className="remove-button">remove</button>}
          </div>

        )
        }
      </div>
    </div>
  );
};

export default Blog;

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLikeButton: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  removeBlogFrontend: PropTypes.func.isRequired
};