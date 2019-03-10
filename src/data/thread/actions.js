import { ACTIONS } from "./constants";
import { ENDPOINTS } from "data/constants";

import request from "utils/request";

export const fetchThreadLinks = forumId => {
  return dispatch => {
    dispatch(fetchThreadLinksRequest());

    return request(ENDPOINTS.FORUM + `/${forumId}`)
      .then(data => {
        dispatch(fetchThreadLinksSuccess(forumId, data.payload));
      })
      .catch(err => {
        dispatch(fetchThreadLinksFailure());
      });
  };
};

const fetchThreadLinksRequest = () => ({
  type: ACTIONS.FETCH_THREAD_LINKS_REQUEST
});

const fetchThreadLinksSuccess = (forumId, threads) => ({
  type: ACTIONS.FETCH_THREAD_LINKS_SUCCESS,
  data: { forumId, threads }
});

const fetchThreadLinksFailure = () => ({
  type: ACTIONS.FETCH_THREAD_LINKS_FAILURE
});

export const fetchThread = threadId => {
  return dispatch => {
    dispatch(fetchThreadRequest());

    return request(ENDPOINTS.THREAD + `/${threadId}`)
      .then(data => {
        dispatch(fetchThreadSuccess(threadId, data.payload));
      })
      .catch(err => {
        dispatch(fetchThreadFailure());
      });
  };
};

const fetchThreadRequest = () => ({
  type: ACTIONS.FETCH_THREAD_REQUEST
});

const fetchThreadSuccess = (threadId, { forumId, posts, meta }) => ({
  type: ACTIONS.FETCH_THREAD_SUCCESS,
  data: { threadId, forumId, posts, meta }
});

const fetchThreadFailure = () => ({
  type: ACTIONS.FETCH_THREAD_FAILURE
});
