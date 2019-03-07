import { ACTIONS } from "./constants";

const initialState = {
  threads: {},
  isFetching: false
};

const forum = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_THREAD_LINKS_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case ACTIONS.FETCH_THREAD_LINKS_SUCCESS:
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.data.forumId]: [
            ...(state.threads[action.data.forumId] || []),
            ...action.data.threads
          ]
        },
        isFetching: false
      };
    case ACTIONS.FETCH_THREAD_LINKS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

export default forum;
