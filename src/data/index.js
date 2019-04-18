import { combineReducers } from "redux";

import user from "./user/reducer";
import forum from "./forum/reducer";
import thread from "./thread/reducer";

export default combineReducers({
  forum,
  thread,
  user
});
