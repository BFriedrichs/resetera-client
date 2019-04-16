import { storeData } from "utils/persist";
import { ACTIONS as OtherActions } from "data/user/constants";

export const sessionMiddleware = store => next => action => {
  let result = next(action);
  if (action.type in OtherActions) {
    const settings = store.getState().user;
    storeData("settings", settings).then(result => {
      console.log("Saved Settings", settings);
    });
  }
  return result;
};
