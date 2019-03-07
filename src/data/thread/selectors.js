import { createSelector } from "reselect";

const threadSelector = state => state.thread.threads;

export const selectThreadsFromForum = forumId =>
  createSelector(
    threadSelector,
    threads => threads[forumId] || []
  );
