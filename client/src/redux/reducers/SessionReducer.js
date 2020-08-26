const initialState = {
  loggedIn: false,
  name: undefined,
  username: undefined,
  userId: undefined,
  redirectPath: "",
};
// These are the actions related to Login status
export default function SessionReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN":
      state.username = action.username;
      state.loggedIn = true;
      state.name = action.name;
      state.userId = action.userId;
      return state;
    case "LOGOUT":
      state.username = "";
      state.loggedIn = false;
      state.name = "";
      state.userId = undefined;
      state.selectedCategory = undefined;
      state.categoriesOpen = true;
      state.searchQ = {};
      return state;
    case "REDIRECT-PATH":
      state.redirectPath = action.path;
      return state;
    default:
      return state;
  }
}
