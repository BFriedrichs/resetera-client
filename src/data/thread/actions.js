import { ACTIONS } from "./constants";
import { ENDPOINTS } from "data/constants";

import request from "utils/request";

export const fetchThreadLinks = (forumId, page = 1) => {
  return dispatch => {
    dispatch(fetchThreadLinksRequest());

    return request(ENDPOINTS.FORUM + `/${forumId}/${page}`)
      .then(data => {
        dispatch(fetchThreadLinksSuccess(forumId, data.payload));
      })
      .catch(err => {
        console.log(err);
        dispatch(fetchThreadLinksFailure());
      });
  };
};

const fetchThreadLinksRequest = () => ({
  type: ACTIONS.FETCH_THREAD_LINKS_REQUEST
});

const fetchThreadLinksSuccess = (forumId, payload) => ({
  type: ACTIONS.FETCH_THREAD_LINKS_SUCCESS,
  data: { forumId, ...payload }
});

const fetchThreadLinksFailure = () => ({
  type: ACTIONS.FETCH_THREAD_LINKS_FAILURE
});

export const fetchThread = threadId => {
  return dispatch => {
    dispatch(fetchThreadRequest(threadId));

    return request(ENDPOINTS.THREAD + `/${threadId}`)
      .then(data => {
        dispatch(fetchThreadSuccess(threadId, data.payload));
      })
      .catch(err => {
        console.log(err);
        dispatch(fetchThreadFailure());
      });
  };
};

const fetchThreadRequest = threadId => ({
  type: ACTIONS.FETCH_THREAD_REQUEST,
  data: { threadId }
});

const fetchThreadSuccess = (threadId, { forumId, posts, meta }) => ({
  type: ACTIONS.FETCH_THREAD_SUCCESS,
  data: { threadId, forumId, posts, meta }
});

const fetchThreadFailure = () => ({
  type: ACTIONS.FETCH_THREAD_FAILURE
});

export const fetchPosts = (threadId, page = 1) => {
  return dispatch => {
    dispatch(fetchPostsRequest());

    return request(ENDPOINTS.THREAD + `/${threadId}/${page}`)
      .then(data => {
        dispatch(fetchPostsSuccess(threadId, data.payload));
      })
      .catch(err => {
        console.log(err);
        dispatch(fetchPostsFailure());
      });
  };
};

const fetchPostsRequest = () => ({
  type: ACTIONS.FETCH_POSTS_REQUEST
});

const fetchPostsSuccess = (threadId, payload) => ({
  type: ACTIONS.FETCH_POSTS_SUCCESS,
  data: { threadId, ...payload }
});

const fetchPostsFailure = () => ({
  type: ACTIONS.FETCH_POSTS_FAILURE
});
