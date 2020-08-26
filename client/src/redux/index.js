import produce from "immer";
import { combineReducers } from "redux-immer";
import { GeneralReducer } from "./reducers/index.js";
import { SessionReducer } from "./reducers/index.js";
import { OptionsReducer } from "./reducers/index.js";

const reducer = combineReducers(produce, {
  base: GeneralReducer,
  session: SessionReducer,
  option: OptionsReducer,
});
export default reducer;
