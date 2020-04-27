import produce from "immer";

const initialState = {
  searchQ: {},
  items: [],
  categories: [],
  selectedCategory: undefined,
  actionItem: undefined,
  categoriesOpen: true,
  language: "en",
};

export default function GeneralReducer(state = initialState, action) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case "SEARCH":
        draftState.searchQ = action.searchQ;
        break;
      case "GET_ITEMS":
        draftState.items = action.items;
        break;
      case "GET_CATEGORIES":
        draftState.categories = action.categories;
        break;
      case "SELECTED_CATEGORY":
        draftState.selectedCategory = action.category;
        draftState.searchQ.input = "";
        break;
      case "ACTION_ITEM":
        draftState.actionItem = action.item;
        break;
      case "RESET-SEARCH":
        draftState.selectedCategory = action.category;
        draftState.searchQ = {};
        break;
      case "ITEM-UPDATED":
        console.log(action.item._id);
        const index = draftState.items.findIndex(
          (item) => item._id === action.item._id
        );
        if (index === -1) break;
        draftState.items[index] = action.item;
        draftState.actionItem = action.item;
        break;
      case "CATEGORIES-OPEN":
        draftState.categoriesOpen = true;
        break;
      case "CATEGORIES-CLOSE":
        draftState.categoriesOpen = false;
        break;
      case "CHANGE-LANGUAGE":
        draftState.language = action.language;
        break;
      default:
        return state;
    }
  });
}

// import produce from "immer";

// const initialState = {
//   loggedIn: false,
//   name: undefined,
//   username: undefined,
//   userId: undefined,
//   searchQ: {},
//   items: [],
//   categories: [],
//   selectedCategory: undefined,
//   actionItem: undefined,
//   categoriesOpen: true,
//   redirectPath: "",
//   language: "en",
// };

// export default function Reducer(state = initialState, action) {
//   return produce(state, (draftState) => {
//     switch (action.type) {
//       case "LOGIN":
//         draftState.username = action.username;
//         draftState.loggedIn = true;
//         draftState.name = action.name;
//         draftState.userId = action.userId;
//         break;
//       case "LOGOUT":
//         draftState.username = "";
//         draftState.loggedIn = false;
//         draftState.name = "";
//         draftState.userId = undefined;
//         draftState.selectedCategory = undefined;
//         draftState.categoriesOpen = true;
//         draftState.searchQ = {};
//         break;
//       case "SEARCH":
//         draftState.searchQ = action.searchQ;
//         break;
//       case "GET_ITEMS":
//         draftState.items = action.items;
//         break;
//       case "GET_CATEGORIES":
//         draftState.categories = action.categories;
//         break;
//       case "SELECTED_CATEGORY":
//         draftState.selectedCategory = action.category;
//         draftState.searchQ.input = "";
//         break;
//       case "ACTION_ITEM":
//         draftState.actionItem = action.item;
//         break;
//       case "RESET-SEARCH":
//         draftState.selectedCategory = action.category;
//         draftState.searchQ = {};
//         break;
//       case "ITEM-UPDATED":
//         console.log(action.item._id);
//         const index = draftState.items.findIndex(
//           (item) => item._id === action.item._id
//         );
//         if (index === -1) break;
//         draftState.items[index] = action.item;
//         draftState.actionItem = action.item;
//         break;
//       case "CATEGORIES-OPEN":
//         draftState.categoriesOpen = true;
//         break;
//       case "CATEGORIES-CLOSE":
//         draftState.categoriesOpen = false;
//         break;
//       case "REDIRECT-PATH":
//         draftState.redirectPath = action.path;
//         break;
//       case "CHANGE-LANGUAGE":
//         draftState.language = action.language;
//         break;
//       default:
//         return state;
//     }
//   });
// }
