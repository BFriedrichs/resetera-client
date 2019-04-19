import { storeData } from "utils/persist";
import { ACTIONS } from "data/user/constants";
import { getSettings } from "data/user/selectors";

const saveableActions = [
  ACTIONS.TOGGLE_THEME,
  ACTIONS.SET_PUSH_CONFIG_SUCCESS,
  ACTIONS.SET_PUSH_CONFIG_FAILURE,
  ACTIONS.MARK_AS_READ,
  ACTIONS.ADD_TO_THREAD_CACHE
];

export const sessionMiddleware = store => next => action => {
  let result = next(action);
  if (saveableActions.indexOf(action.type) !== -1) {
    const settings = getSettings(store.getState());
    storeData("settings", settings).then(_ => {
      console.info("Saved Settings", settings);
    });
  }
  return result;
};
