const express = require('express');
const router = express.Router();
const configs = require('../util/config')
const {getAsync} = require("../redis");

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get("/statistics", async (req, res) => {
  const todosAdded = await getAsync("todos_added");
  if (!todosAdded) {
    res.json({todos_added: 0});
  } else {
    res.json({todos_added: todosAdded});
  }
})

router.get("/reload", (req, res) => {
  res.json({ message: "Testing Hot Reload By Changing Me" })
})

module.exports = router;
