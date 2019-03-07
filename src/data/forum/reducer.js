import { ACTIONS } from "./constants";

const initialState = {
  forums: [],
  isFetching: false
};

const forum = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_FORUM_LINKS_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case ACTIONS.FETCH_FORUM_LINKS_SUCCESS:
      return {
        ...state,
        forums: [...action.data],
        isFetching: false
      };
    case ACTIONS.FETCH_FORUM_LINKS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

export default forum;
