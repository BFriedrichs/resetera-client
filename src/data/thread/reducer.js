import { ACTIONS } from "./constants";

const initialState = {
  threads: {},
  isFetching: false
};

const thread = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_THREAD_LINKS_REQUEST:
    case ACTIONS.FETCH_THREAD_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case ACTIONS.FETCH_THREAD_LINKS_SUCCESS:
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.data.forumId]: {
            ...(state.threads[action.data.forumId] || {}),
            ...action.data.threads.reduce((r, d) => {
              r[d.id] = d;
              return r;
            }, {})
          }
        },
        isFetching: false
      };
    case ACTIONS.FETCH_THREAD_LINKS_FAILURE:
    case ACTIONS.FETCH_THREAD_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case ACTIONS.FETCH_THREAD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        threads: {
          ...state.threads,
          [action.data.forumId]: {
            ...(state.threads[action.data.forumId] || {}),
            [action.data.threadId]: action.data.meta
          }
        }
      };
    default:
      return state;
  }
};

export default thread;
