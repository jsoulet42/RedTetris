// ./src/redux/store.js : Configure le store Redux avec les reducers et middlewares.

import { configureStore } from "@reduxjs/toolkit";
import promiseMiddleware from "redux-promise";
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(promiseMiddleware),
  devTools: process.env.NODE_ENV !== "production", // Active Redux DevTools en développement
});

export default store;
