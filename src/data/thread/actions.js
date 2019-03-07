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
