import { createStore } from 'redux'
import { sayHiOnDispatch } from './exampleAddons/enhancers'

function reducer(state, action) {
  switch (action.type) {
    case 'tasks/add':
      console.log(`Adding ${action.payload}`)
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: state.tasks.length,
            description: action.payload,
            complete: false,
            tags: [],
          },
        ],
      }
    default:
      return state
  }
}

const initialState = {
  tasks: [],
  // I didn't realize that filters were a good thing to put in global state too --
  // There could be components which depend on the filtered view in addition to the global view
  filters: {
    status: 'active',
    tags: [],
  },
}
const store = createStore(reducer, initialState, sayHiOnDispatch)

export default store
