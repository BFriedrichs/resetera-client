import { createSelector } from "reselect";

const settingsSelector = state => state.other.settings;

export const getSettings = settingsSelector;
