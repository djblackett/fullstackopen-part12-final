import React from 'react'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  const onClickDelete = (todo) => () => {
    deleteTodo(todo)
  }

  const onClickComplete = (todo) => () => {
    completeTodo(todo)
  }

  return (
    <>
      <h1>HOT RELOAD!</h1>
      <h6>Yay it worked!!!</h6>
      <h6>But what about with the proxy?</h6>
      {todos.map(todo => {
        const doneInfo = (
          <div>
            <span>This todo is done</span>
            <span>
              <button onClick={onClickDelete(todo)}> Delete </button>
            </span>
          </div>
        )

        const notDoneInfo = (
          <>
            <span>
              This todo is not done
            </span>
            <span>
              <button onClick={onClickDelete(todo)}> Delete </button>
              <button onClick={onClickComplete(todo)}> Set as done </button>
            </span>
          </>
        )

        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }} key={todo.text}>
            <span>
              {todo.text}
            </span>
            {todo.done ? doneInfo : notDoneInfo}
          </div>
        )
      }).reduce((acc, cur) => [...acc, <hr />, cur], [])} {/* eslint-disable-line */}
    </>
  )
}

export default TodoList
