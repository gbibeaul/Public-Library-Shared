import { createStore } from "redux";
import { combineReducers } from "redux-immer";
import produce from "immer";
import SessionReducer from "./SessionReducer";
import GeneralReducer from "./GeneralReducer";

const store = createStore(
  combineReducers(produce, { SessionReducer, GeneralReducer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
