const initialState = {
  searchQ: {},
  selectedCategory: undefined,
  categoriesOpen: true,
  language: "en",
};
// These are the actions that user may do regardless of Login status
export default function OptionsReducer(state = initialState, action) {
  switch (action.type) {
    case "SEARCH":
      state.searchQ = action.searchQ;
      return state;
    case "SELECTED_CATEGORY":
      state.selectedCategory = action.category;
      state.searchQ.input = "";
      return state;
    case "RESET-SEARCH":
      state.selectedCategory = action.category;
      state.searchQ = {};
      return state;
    case "CATEGORIES-OPEN":
      state.categoriesOpen = true;
      return state;
    case "CATEGORIES-CLOSE":
      state.categoriesOpen = false;
      return state;
    case "CHANGE-LANGUAGE":
      state.language = action.language;
      return state;
    default:
      return state;
  }
}
