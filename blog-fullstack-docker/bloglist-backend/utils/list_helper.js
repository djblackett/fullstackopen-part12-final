const _ = require("lodash");

const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  if (blogs.length === 0) {
    return 0;
  }

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const comparator = (a, b) => {
    return a.likes - b.likes;
  };
  
  const sortedArr = [...blogs].sort(comparator);
  const mostLiked = sortedArr[sortedArr.length - 1];
  return ({
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes
  });
};

const mostBlogs = (blogs) => {
  const blogFreq = {};

  for (const blog of blogs) {
    if (!_.has(blogFreq, blog.author)) {
      blogFreq[blog.author] = 1;
    } else {
      blogFreq[blog.author] = blogFreq[blog.author] + 1;
    }
  }

  let maxAuthor = "";
  let max = 0;
  for (let author of Object.keys(blogFreq)) {
    if (blogFreq[author] > max) {
      maxAuthor = author;
      max = blogFreq[author];
    }
  }

  return {
    author: maxAuthor,
    blogs: max
  };
};

const mostLikes = (blogs) => {
  const likeFreq = {};

  for (const blog of blogs) {
    if (!_.has(likeFreq, blog.author)) {
      likeFreq[blog.author] = blog.likes;
    } else {
      likeFreq[blog.author] = likeFreq[blog.author] + blog.likes;
    }
  }

  let maxAuthor = "";
  let max = 0;
  for (let author of Object.keys(likeFreq)) {
    if (likeFreq[author] > max) {
      maxAuthor = author;
      max = likeFreq[author];
    }
  }

  return {
    author: maxAuthor,
    likes: max
  };

};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes

};

