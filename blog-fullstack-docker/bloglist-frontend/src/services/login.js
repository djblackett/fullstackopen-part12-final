import axios from "axios";
import { baseUrl } from "../util/config";

const login = async (username, password) => {
  const userInfo = {
    username: username,
    password: password
  };
  const response = await axios.post(`${baseUrl}/login`, userInfo);
  return response.data;
};

export default { login };