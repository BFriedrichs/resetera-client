import { createSelector } from "reselect";

export const userSelector = state => state.user;

export const getSettings = createSelector(
  userSelector,
  user => user.settings
);

export const getCachedThread = threadId =>
  createSelector(
    getSettings,
    settings => settings.threadCache.find(e => e.id === threadId)
  );

export const getPushToken = createSelector(
  userSelector,
  user => user.pushToken
);
