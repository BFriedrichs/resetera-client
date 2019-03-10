import React from "react";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { composeWithDevTools } from "redux-devtools-extension";

import Home from "./src/screens/Home";
import Forum from "./src/screens/Forum";
import Thread from "./src/screens/Thread";

import reducers from "./src/data";

const UITheme = {
  palette: {
    primaryColor: "#8848c6"
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
        backgroundColor: UITheme.palette.primaryColor
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
