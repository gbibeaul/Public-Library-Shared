const initialState = {
  items: [],
  categories: [],
  actionItem: undefined,
};

// These are the actions that are more related to app not the user
export default function GeneralReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_ITEMS":
      state.items = action.items;
      return state;
    case "GET_CATEGORIES":
      state.categories = action.categories;
      return state;
    case "ACTION_ITEM":
      state.actionItem = action.item;
      return state;
    case "ITEM-UPDATED":
      const index = state.items.findIndex(
        (item) => item._id === action.item._id
      );
      if (index === -1) return state;
      state.items[index] = action.item;
      state.actionItem = action.item;
      return state;
    default:
      return state;
  }
}
