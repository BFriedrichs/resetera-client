import produce from "immer";
import { ACTIONS } from "./constants";

export const initialState = {
  open: false,
  pushToken: null,
  settings: {
    darkMode: false,
    pushActive: true,
    markAsRead: true,
    threadCache: []
  }
};

const user = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case ACTIONS.TOGGLE_THEME:
        draft.settings.darkMode = !draft.settings.darkMode;
        break;
      case ACTIONS.MARK_AS_READ:
        draft.settings.markAsRead = action.data;
        break;
      case ACTIONS.TOGGLE_SETTINGS_DISPLAY:
        draft.open = !draft.open;
        break;
      case ACTIONS.ADD_TO_THREAD_CACHE: {
        const ids = draft.settings.threadCache.map(e => e.id);
        const index = ids.indexOf(action.data.id);
        if (index === -1) {
          draft.settings.threadCache.push(action.data);
          if (draft.settings.threadCache.length > 500) {
            draft.settings.threadCache.splice(0, 1);
          }
        } else {
          draft.settings.threadCache[index] = action.data;
        }
        break;
      }
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
