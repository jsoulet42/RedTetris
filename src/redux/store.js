// ./src/redux/store.js

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import promiseMiddleware from "redux-promise";
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les chemins des slices 'test' et 'game'
        ignoredPaths: ["test", "game"],
      },
    }).concat(promiseMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
