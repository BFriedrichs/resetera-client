import { ACTIONS } from "./constants";
import { ENDPOINTS } from "data/constants";

import request from "utils/request";

export const toggleTheme = () => ({
  type: ACTIONS.TOGGLE_THEME
});

export const addToThreadCache = (threadId, page) => ({
  type: ACTIONS.ADD_TO_THREAD_CACHE,
  data: { id: threadId, page }
});

export const setPushToken = token => ({
  type: ACTIONS.SET_PUSH_TOKEN,
  data: { token }
});

export const toggleSettingsDisplay = () => ({
  type: ACTIONS.TOGGLE_SETTINGS_DISPLAY
});

export const setPushActive = (token, active) => {
  return dispatch => {
    dispatch(setPushActiveRequest());

    return request(ENDPOINTS.PUSH + "/active", { token, active })
      .then(data => {
        dispatch(setPushActiveSuccess(active));
      })
      .catch(err => {
        console.log(err);
        dispatch(setPushActiveFailure(!active));
      });
  };
};

const setPushActiveRequest = () => ({
  type: ACTIONS.SET_PUSH_ACTIVE_REQUEST
});

const setPushActiveSuccess = active => ({
  type: ACTIONS.SET_PUSH_ACTIVE_SUCCESS,
  data: { active }
});

const setPushActiveFailure = active => ({
  type: ACTIONS.SET_PUSH_ACTIVE_FAILURE,
  data: { active }
});
