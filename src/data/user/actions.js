import { ACTIONS } from "./constants";
import { ENDPOINTS } from "data/constants";

import request from "utils/request";

export const toggleTheme = () => ({
  type: ACTIONS.TOGGLE_THEME
});

export const markAsRead = mark => ({
  type: ACTIONS.MARK_AS_READ,
  data: mark
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

export const setPushConfig = (token, config) => {
  return dispatch => {
    dispatch(setPushConfigRequest());

    return request(ENDPOINTS.PUSH + "/config", { token, config })
      .then(_ => {
        dispatch(setPushConfigSuccess(config));
      })
      .catch(err => {
        console.error(err);
        dispatch(setPushConfigFailure(config));
      });
  };
};

const setPushConfigRequest = () => ({
  type: ACTIONS.SET_PUSH_CONFIG_REQUEST
});

const setPushConfigSuccess = config => ({
  type: ACTIONS.SET_PUSH_CONFIG_SUCCESS,
  data: { config }
});

const setPushConfigFailure = config => ({
  type: ACTIONS.SET_PUSH_CONFIG_FAILURE,
  data: { config }
});
