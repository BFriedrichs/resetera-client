import { combineReducers } from "redux";

import settings from "./settings/reducer";
import forum from "./forum/reducer";
import thread from "./thread/reducer";
import post from "./post/reducer";

export default combineReducers({
  settings,
  forum,
  thread,
  post
});
