import React from "react";
import thunkMiddleware from "redux-thunk";
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  Provider as PaperThemeProvider,
  DefaultTheme
} from "react-native-paper";
import { ThemeProvider } from "styled-components/native";
import Color from "utils/color-helper";

import Home from "./src/screens/Home";
import Forum from "./src/screens/Forum";
import Thread from "./src/screens/Thread";

import ThemeToggle from "components/ThemeToggle";

import reducers from "./src/data";

const UITheme = {
  palette: {
    primaryColor: Color("#8848c6")
  },
  light: {
    ...DefaultTheme,
    background: Color("#f1f1f1"),
    text: Color("#243447")
  },
  dark: {
    ...DefaultTheme,
    dark: true,
    background: Color("#243447"),
    text: Color("#f1f1f1")
  }
};

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

const AppNavigator = createStackNavigator(
  {
    Home: Home,
    Forum: Forum,
    Thread: Thread
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: UITheme.palette.primaryColor.string(),
        borderBottomColor: UITheme.palette.primaryColor.darken(0.2).string()
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      },
      headerRight: <ThemeToggle />
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

const ThemeConnector = ({ theme }) => (
  <PaperThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>
      <AppContainer />
    </ThemeProvider>
  </PaperThemeProvider>
);

const mapThemeToProps = state => ({
  theme: UITheme[state.other.settings.darkMode ? "dark" : "light"]
});
const ConnectedThemeConnector = connect(mapThemeToProps)(ThemeConnector);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedThemeConnector />
      </Provider>
    );
  }
}
