import produce from "immer";
import { ACTIONS } from "./constants";

const initialState = {
  threadScrollable: true,
  imageCache: {},
  settings: {
    darkMode: true
  }
};

const other = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case ACTIONS.SET_THREAD_SCROLLABLE:
        draft.threadScrollable = action.data;
        break;
      case ACTIONS.ADD_TO_IMAGE_CACHE:
        draft.imageCache[action.data.url] = { size: action.data.size };
        break;
      case ACTIONS.TOGGLE_THEME:
        draft.settings.darkMode = !draft.settings.darkMode;
        break;
    }
  });
};

export default other;
