import produce from "immer";

const initialState = {
  loggedIn: false,
  name: undefined,
  username: undefined,
  userId: undefined,
  redirectPath: "",
};

export default function SessionReducer(state = initialState, action) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case "LOGIN":
        draftState.username = action.username;
        draftState.loggedIn = true;
        draftState.name = action.name;
        draftState.userId = action.userId;
        break;
      case "LOGOUT":
        draftState.username = "";
        draftState.loggedIn = false;
        draftState.name = "";
        draftState.userId = undefined;
        draftState.selectedCategory = undefined;
        draftState.categoriesOpen = true;
        draftState.searchQ = {};
        break;
      case "REDIRECT-PATH":
        draftState.redirectPath = action.path;
        break;
      default:
        return state;
    }
  });
}
