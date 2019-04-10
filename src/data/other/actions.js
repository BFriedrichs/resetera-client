import { ACTIONS } from "./constants";

export const setThreadScrollable = scrollable => ({
  type: ACTIONS.SET_THREAD_SCROLLABLE,
  data: scrollable
});

export const addToImageCache = (url, size) => ({
  type: ACTIONS.ADD_TO_IMAGE_CACHE,
  data: { url, size }
});

export const toggleTheme = () => ({
  type: ACTIONS.TOGGLE_THEME
});
