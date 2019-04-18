import { AsyncStorage } from "react-native";

export const storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(
      `@ReseteraStore:${key}`,
      `${JSON.stringify(data)}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const loadData = async key => {
  try {
    const value = await AsyncStorage.getItem(`@ReseteraStore:${key}`);
    return JSON.parse(value);
  } catch (error) {
    console.error(error);
  }
};
