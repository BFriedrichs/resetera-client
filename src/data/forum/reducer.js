import produce from "immer";
import { ACTIONS } from "./constants";
import { ACTIONS as THREAD_ACTIONS } from "data/thread/constants";

const initialState = {
  forums: {},
  isFetching: false
};

const forum = (state = initialState, action) => {
  return produce(state, draft => {
    const forumId = action.data && action.data.forumId;
    switch (action.type) {
      case ACTIONS.FETCH_FORUM_LINKS_REQUEST:
        draft.isFetching = true;
        break;
      case ACTIONS.FETCH_FORUM_LINKS_SUCCESS:
        action.data.forEach(f => {
          draft.forums[f.id] = f;
        });
        draft.isFetching = false;
        break;
      case ACTIONS.FETCH_FORUM_LINKS_FAILURE:
        draft.isFetching = false;
        break;
      case THREAD_ACTIONS.FETCH_THREAD_LINKS_SUCCESS:
        draft.forums[forumId].meta.pages = action.data.meta.pages;
        break;
    }
  });
};

export default forum;
