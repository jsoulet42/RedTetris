// testReducer.js : Un reducer de test pour vérifier que Redux fonctionne.

import { Map } from "immutable";

const initialState = Map({
  message: "Hello from Redux!",
});

function testReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default testReducer;
