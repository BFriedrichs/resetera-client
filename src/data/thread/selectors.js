import { createSelector } from "reselect";
import { selectForum } from "data/forum/selectors";

const threadSelector = state => state.thread.threads;
const idMapSelector = state => state.thread.idMapped;

export const selectThreadsFromForum = (forumId, page = 1) => state =>
  createSelector(
    threadSelector,
    threads => Object.values(threads[forumId] || [])
  )(state)
    .filter(thread => thread.page == page)
    .sort((a, b) => a.order - b.order);

export const getForumIdFromThreadId = threadId =>
  createSelector(
    idMapSelector,
    idMap => idMap[threadId] || null
  );

export const getForumFromThreadId = threadId => state => {
  const forumId = getForumIdFromThreadId(threadId)(state);
  return selectForum(forumId)(state);
};

export const selectPostsFromThread = (threadId, page = 1) => state => {
  const forumId = getForumIdFromThreadId(threadId)(state);
  return createSelector(
    threadSelector,
    threads =>
      ((threads[forumId] && threads[forumId][threadId]) || { posts: [] })
        .posts || []
  )(state).filter(post => post.page == page);
};

export const selectThread = (forumId, threadId) =>
  createSelector(
    threadSelector,
    threads => threads[forumId] && threads[forumId][threadId]
  );
