const express = require('express');
const { Todo } = require('../mongo')
const {setAsync, getAsync} = require("../redis");
const router = express.Router();
require("http-proxy-middleware")

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
    const num = await getAsync("todos_added");
    if (num) {
        setAsync("todos_added", Number(num) + 1);
    } else {
        setAsync("todos_added", 1);
    }
    res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.json(req.todo);
  // res.sendStatus(405); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
    const id = req.todo.id;
    const updated = {...req.body, id};
    await Todo.findByIdAndUpdate(id, updated);
    res.json(updated);
  // res.sendStatus(405); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
