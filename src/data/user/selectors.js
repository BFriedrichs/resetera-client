import { createSelector } from "reselect";

export const userSelector = state => state.user;

export const getSettings = createSelector(
  userSelector,
  user => user.settings
);

export const getCachedThread = threadId =>
  createSelector(
    userSelector,
    user => user.threadCache.find(e => e.id === threadId)
  );

export const getPushToken = createSelector(
  userSelector,
  user => user.pushToken
);
