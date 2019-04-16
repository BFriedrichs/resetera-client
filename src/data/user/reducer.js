import produce from "immer";
import { ACTIONS } from "./constants";

export const initialState = {
  open: false,
  threadCache: [],
  pushToken: null,
  settings: {
    darkMode: false,
    pushActive: true
  }
};

const user = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case ACTIONS.TOGGLE_THEME:
        draft.settings.darkMode = !draft.settings.darkMode;
        break;
      case ACTIONS.TOGGLE_SETTINGS_DISPLAY:
        draft.open = !draft.open;
        break;
      case ACTIONS.ADD_TO_THREAD_CACHE:
        const ids = draft.threadCache.map(e => e.id);
        const index = ids.indexOf(action.data.id);
        if (index === -1) {
          draft.threadCache.push(action.data);
          if (draft.threadCache.length > 100) {
            draft.threadCache.splice(0, 1);
          }
        } else {
          draft.threadCache[index] = action.data;
        }
        break;
      case ACTIONS.SET_PUSH_TOKEN:
        draft.pushToken = action.data.token;
        break;
      case ACTIONS.SET_PUSH_ACTIVE_REQUEST:
        break;
      case ACTIONS.SET_PUSH_ACTIVE_FAILURE:
      case ACTIONS.SET_PUSH_ACTIVE_SUCCESS:
        draft.settings.pushActive = action.data.active;
        break;
    }
  });
};

export default user;
