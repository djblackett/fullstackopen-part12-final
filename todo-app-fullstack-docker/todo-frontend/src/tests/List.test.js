import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

import List from '../Todos/List'


jest.mock('axios')


const todos = [
  { text: 'I got stuff to do', done: true },
  { text: 'Walk the dog', done: false },
  { text: 'Eat some meat', done: false }
]

describe('<TodoView />', () => {

  it('Should do stuff', async () => {
    render(
      <List todos={todos} />
    )

    expect(screen.getByText('Walk the dog')).toBeInTheDocument()
  })
})