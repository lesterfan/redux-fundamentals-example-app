import React, { useState } from 'react'
import { createStore } from 'redux'

const initialState = {
  tasks: [],
}
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'tasks/add':
      console.log(`Adding ${action.payload}`)
      return {
        tasks: [
          ...state.tasks,
          { desc: action.payload, complete: false, tags: [] },
        ],
      }
    default:
      return state
  }
}
const reduxStore = createStore(reducer)
reduxStore.subscribe(() => {
  console.log('Rendering!')
})

function App() {
  const [todoItem, setTodoItem] = useState('')
  return (
    <div className="App">
      <nav>
        <section>
          <h1>Redux Fundamentals Example</h1>
        </section>
      </nav>
      <section>
        <h2>Todos</h2>
      </section>
      <section>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log(`Submitted form with value ${todoItem}`)
            // Add this task to redux here
            reduxStore.dispatch({ type: 'tasks/add', payload: todoItem })
          }}
        >
          <label>What needs to be done?</label>
          <input
            type="text"
            onChange={(e) => {
              setTodoItem(e.target.value)
            }}
          ></input>
        </form>
      </section>
    </div>
  )
}

export default App
