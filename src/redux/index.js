import produce from "immer";
import { combineReducers } from "redux-immer";
import { GeneralReducer } from "./reducers/index";
import { SessionReducer } from "./reducers/index";

const reducer = combineReducers(produce, {
  base: GeneralReducer,
  session: SessionReducer,
});
export default reducer;
