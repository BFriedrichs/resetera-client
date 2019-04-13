import { ACTIONS } from "./constants";

export const toggleTheme = () => ({
  type: ACTIONS.TOGGLE_THEME
});

export const addToThreadCache = (threadId, page) => ({
  type: ACTIONS.ADD_TO_THREAD_CACHE,
  data: { id: threadId, page }
});
