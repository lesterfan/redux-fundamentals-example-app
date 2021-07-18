import { applyMiddleware, compose, createStore } from 'redux'
import { sayHiOnDispatch } from './exampleAddons/enhancers'
import {
  myMiddleware,
  print1,
  print2,
  print3,
} from './exampleAddons/middleware'
import _ from 'lodash'

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
  filters: {
    status: 'active',
    tags: [],
  },
}

function myCreateStore(reducer, initialState) {
  let currState = initialState
  let subscriberCBs = []
  return {
    dispatch: (action) => {
      currState = reducer(currState, action)
      for (const subscriberCB of subscriberCBs) {
        subscriberCB()
      }
    },
    getState: () => {
      return currState
    },
    subscribe: (subscriberCB) => {
      subscriberCBs.push(subscriberCB)
      return function unsubscribe() {
        const index = subscriberCBs.indexOf(subscriberCB)
        subscriberCBs.splice(index, 1)
      }
    },
  }
}
// Equivalent function with enhancer:
// function myCreateStore(reducer, intiialState, enhancer) {
//   return enhancer(myCreateStore(reducer, initialState))
// }

// My basic implementation of applyMiddleware(...middlewares)
function myApplyMiddleware(...middlewares) {
  // applyMiddleware() returns an enhancer
  return function enhancer(createStoreFunc) {
    // Enhancers return a createStore function which just decorate the
    // dispatch(), getState() and subscribe() functions
    return function myCreateStoreFunc(...args) {
      const store = createStoreFunc(...args)

      // In the returned store, we want the following:
      // store.dispatch(action) :=
      //    store.dispatch(
      //      middlewares[0](store)( // wrapDispatch[0] (
      //        middlewares[1](store)( // wrapDispatch[1] (
      //          middlewares[2](store)( // wrapDispatch[2] (
      //            ...
      //              middlewares[n-1](store)( // wrapDispatch[n-1] (
      //                (action => action) (
      //                  action
      //                )
      //              )
      //            ...
      //          )
      //        )
      //      )
      //    )
      // where
      // middlewares[i] = function(storeAPI) {
      //   return function wrapDispatch(nextWrapDispatch) {
      //     return function handleAction(action) {
      //       /* Do stuff here */
      //       return nextWrapDispatch(action)
      //     }
      //   }
      // }
      // The function gymnastics below is to compose everything which isn't action into its own function
      // (i.e. in the formula above, compose everything that isn't action into its own function so we can just
      // compute it once and have the effect happen for all dispatches)
      // Note that compose(f,g,h) = f(g(h)), so
      // compose(f,g,h)(...args) = f(g(h(...args)))
      return {
        ...store,
        dispatch: compose(
          store.dispatch,
          compose(
            ...middlewares.map((middleware) => {
              return middleware(store)
            })
          )((action) => action)
        ),
      }
    }
  }
}

function middleware1(storeAPI) {
  return function wrapDispatch(nextWrapDispatch) {
    return function handleAction(action) {
      console.log('middleware1 was applied, a was added to the action!')
      action.a = 'a'
      let result = nextWrapDispatch(action)
      console.log(result)
      return result
    }
  }
}
// This seems to be how middlewares are usually written
const middleware2 = (storeAPI) => (next) => (action) => {
  console.log('middleware2 was applied, b was added to the action!')
  action.b = 'b'
  return next(action)
}

const middlewareEnhancer = applyMiddleware(middleware1, middleware2)
const store = createStore(reducer, initialState, middlewareEnhancer)

// Equivalent code (using my custom primitives):
// const middlewareEnhancer = myApplyMiddleware(middleware1, middleware2)
// const decoratedCreateStore = middlewareEnhancer(myCreateStore)
// const store = decoratedCreateStore(reducer, initialState)

export default store
