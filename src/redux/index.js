import produce from "immer";
import { combineReducers } from "redux-immer";
import { GeneralReducer } from "./reducers/index";
import { SessionReducer } from "./reducers/index";
import { OptionsReducer } from "./reducers/index";

const reducer = combineReducers(produce, {
  base: GeneralReducer,
  session: SessionReducer,
  option: OptionsReducer,
});
export default reducer;
