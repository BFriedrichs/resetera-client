import React from "react";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";

import { composeWithDevTools } from "redux-devtools-extension";
import reducers from "data";
import { initialState } from "data/user/reducer";

import { sessionMiddleware } from "utils/redux-middleware";
import { loadData } from "utils/persist";

import SetupAndLoad from "./src/screens/SetupAndLoad";
import AppProvider from "./AppProvider";

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
        {
          user: {
            ...initialState,
            settings: { ...initialState.settings, ...result }
          }
        },
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
        <AppProvider />
      </Provider>
    ) : (
      <SetupAndLoad cb={this.setDone.bind(this)} />
    );
  }
}
