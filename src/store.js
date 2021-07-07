import { createStore } from 'redux'

const initialState = {
  tasks: [],
  // I didn't realize that filters were a good thing to put in global state too --
  // There could be components which depend on the filtered view in addition to the global view
  filters: {
    status: 'active',
    tags: [],
  },
}
function reducer(state = initialState, action) {
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

const store = createStore(reducer)
export default store 
