import { createSelector } from "reselect";

const forumSelector = state => state.forum.forums;

export const selectForum = forumId =>
  createSelector(
    forumSelector,
    forums => forums[forumId]
  );
