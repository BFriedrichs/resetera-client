import { ACTIONS } from "./constants";
import { ENDPOINTS } from "data/constants";

import request from "utils/request";

export const fetchForumLinks = () => {
  return dispatch => {
    dispatch(fetchForumLinksRequest());

    return request(ENDPOINTS.FORUM)
      .then(data => {
        dispatch(fetchForumLinksSuccess(data.payload));
      })
      .catch(err => {
        console.error(err);
        dispatch(fetchForumLinksFailure());
      });
  };
};

const fetchForumLinksRequest = () => ({
  type: ACTIONS.FETCH_FORUM_LINKS_REQUEST
});

const fetchForumLinksSuccess = forums => ({
  type: ACTIONS.FETCH_FORUM_LINKS_SUCCESS,
  data: forums
});

const fetchForumLinksFailure = () => ({
  type: ACTIONS.FETCH_FORUM_LINKS_FAILURE
});
