const initialState = {
  items: [],
  categories: [],
  actionItem: undefined,
};

let index;
function matchItem(items, actionItem) {
  index = items.findIndex((item) => item._id === actionItem._id);
}

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
      matchItem(state.items, action.item);
      if (index === -1) return state;
      state.items[index] = action.item;
      state.actionItem = action.item;
      return state;
    default:
      return state;
  }
}
