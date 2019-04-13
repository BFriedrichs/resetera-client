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
import SetupAndLoad from "./src/screens/SetupAndLoad";
import ThemeToggle from "components/ThemeToggle";

import reducers from "data";
import { initialState } from "data/user/reducer";

import sessionMiddleware from "utils/session-middleware";
import { loadData } from "utils/persist";

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
  theme: UITheme[state.user.darkMode ? "dark" : "light"]
});
const ConnectedThemeConnector = connect(mapThemeToProps)(ThemeConnector);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadedStore: false,
      preloadDone: false
    };

    loadData("settings").then(result => {
      this.store = createStore(
        reducers,
        { user: { ...initialState, ...result } },
        composeWithDevTools(applyMiddleware(thunkMiddleware, sessionMiddleware))
      );
      this.setState({ loadedStore: true });
    });
  }

  setDone() {
    this.setState({ preloadDone: true });
  }

  render() {
    const { loadedStore, preloadDone } = this.state;
    return loadedStore && preloadDone ? (
      <Provider store={this.store}>
        <ConnectedThemeConnector />
      </Provider>
    ) : (
      <SetupAndLoad cb={this.setDone.bind(this)} />
    );
  }
}
