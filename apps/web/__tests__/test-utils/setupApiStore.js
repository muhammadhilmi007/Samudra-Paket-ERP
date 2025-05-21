/**
 * Setup API Store Utility
 * Helper function to create a Redux store with API middleware for testing
 */

const { configureStore } = require('@reduxjs/toolkit');
const { setupListeners } = require('@reduxjs/toolkit/query');

/**
 * Sets up a Redux store with API middleware for testing
 * @param {Object} api - The API slice to include in the store
 * @param {Object} extraReducers - Additional reducers to include in the store
 * @param {Object} options - Additional store configuration options
 * @returns {Object} Store reference object with store and api
 */
function setupApiStore(api, extraReducers = {}, options = {}) {
  const getStore = () =>
    configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
        ...extraReducers,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
      ...options,
    });

  const initialStore = getStore();
  setupListeners(initialStore.dispatch);

  const refObj = {
    api,
    store: initialStore,
    reset: () => {
      refObj.store = getStore();
    },
  };

  return refObj;
}

module.exports = { setupApiStore };
