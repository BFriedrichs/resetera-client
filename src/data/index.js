import { combineReducers } from "redux";

import settings from "./settings/reducer";
import forum from "./forum/reducer";
import thread from "./thread/reducer";

export default combineReducers({
  settings,
  forum,
  thread
});
