import axios from "axios";
import { baseUrl } from "../util/config";

let token = null;

const setToken = (newToken) => {
  token = newToken;
};
const createAuthToken = () => {
  return {
    headers: {
      Authorization: "Bearer " + token
    }
  };
};

const getAll = async () => {

  const config = createAuthToken(token);
  try {
    const request = await axios.get(`${baseUrl}/blogs`, config);
    return request.data;
  } catch (error) {
    console.log(error);
  }
};

const createBlog = async (newBlog) => {
  try {
    const request = await axios.post(`${baseUrl}/blogs`, newBlog, createAuthToken());
    return request.data;
  } catch (error) {
    console.log(error);
  }
};

const updateBlog = async (id, newBlog) => {

  try {
    const request = await axios.put(`${baseUrl}/blogs/${String(id)}`, newBlog, createAuthToken());
    return request.data;
  } catch (error) {
    console.log(error);
  }
};

const removeBlog = async (id) => {
  try {
    await axios.delete(`${baseUrl}/blogs/${id}`, createAuthToken());
  } catch (error) {
    console.log(error);
  }
};

export default { getAll, setToken, createBlog, updateBlog, removeBlog };