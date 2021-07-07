import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import store from './store'

function App() {
  const [todoItem, setTodoItem] = useState('')
  const allTasks = useSelector((state) => {
    return state.tasks
  })
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
            store.dispatch({ type: 'tasks/add', payload: todoItem })
          }}
        >
          <input
            type="text"
            placeholder="What needs to be done?"
            onChange={(e) => {
              setTodoItem(e.target.value)
            }}
          />
        </form>
      </section>
      <section>
        <p>Number of tasks: {allTasks.length}</p>
        {(function getTaskList() {
          return allTasks.map((task) => {
            return <li key={task.id}>{task.description}</li>
          })
        })()}
      </section>
    </div>
  )
}

export default App
