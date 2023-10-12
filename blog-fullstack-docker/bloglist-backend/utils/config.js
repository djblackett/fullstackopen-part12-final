require("dotenv").config();

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;
const SECRET = process.env.SECRET;
const DATABASE_URL = process.env.NODE_ENV === "test" ?
  process.env.TEST_MONGODB_URI :
  process.env.DATABASE_URL;

console.log("Node Environment:", NODE_ENV);

module.exports = {
  DATABASE_URL,
  PORT,
  NODE_ENV,
  SECRET
};