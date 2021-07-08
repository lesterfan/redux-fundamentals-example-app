// Just a decorator around createStore to add our own logic around getState, dispatch, and subscribe
export const sayHiOnDispatch = (createStore) => {
  return (rootReducer, preloadedState, enhancers) => {
    const store = createStore(rootReducer, preloadedState, enhancers)

    function newDispatch(action) {
      const result = store.dispatch(action)
      console.log(`Dispatching ${JSON.stringify(action)}`)
      return result
    }

    return { ...store, dispatch: newDispatch }
  }
}

export const includeMeaningOfLife = (createStore) => {
  return (rootReducer, preloadedState, enhancers) => {
    const store = createStore(rootReducer, preloadedState, enhancers)

    function newGetState() {
      return {
        ...store.getState(),
        meaningOfLife: 42,
      }
    }

    return { ...store, getState: newGetState }
  }
}
