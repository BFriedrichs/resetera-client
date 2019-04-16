import { storeData } from "utils/persist";
import { ACTIONS } from "data/user/constants";
import { getSettings } from "data/user/selectors";

export const sessionMiddleware = store => next => action => {
  let result = next(action);
  if (
    action.type in
    [
      ACTIONS.TOGGLE_THEME,
      ACTIONS.SET_PUSH_ACTIVE_SUCCESS,
      ACTIONS.SET_PUSH_ACTIVE_FAILURE
    ]
  ) {
    const settings = getSettings(store.getState());
    storeData("settings", settings).then(result => {
      console.log("Saved Settings", settings);
    });
  }
  return result;
};
