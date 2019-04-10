import { combineReducers } from "redux";

import other from "./other/reducer";
import forum from "./forum/reducer";
import thread from "./thread/reducer";

export default combineReducers({
  other,
  forum,
  thread
});
