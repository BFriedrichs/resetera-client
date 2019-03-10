import { createSelector } from "reselect";

const threadSelector = state => state.thread.threads;

export const selectThreadsFromForum = forumId =>
  createSelector(
    threadSelector,
    threads => Object.values(threads[forumId] || [])
  );

export const getForumIdFromThreadId = threadId =>
  createSelector(
    threadSelector,
    threads =>
      Object.keys(threads).find(key => threadId in threads[key]) || null
  );
