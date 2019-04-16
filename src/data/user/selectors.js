import { createSelector } from "reselect";

const settingsSelector = state => state.user;

export const getSettings = settingsSelector;

export const getCachedThread = threadId =>
  createSelector(
    settingsSelector,
    user => user.threadCache.find(e => e.id === threadId)
  );

export const getPushToken = createSelector(
  settingsSelector,
  user => user.pushToken
);
