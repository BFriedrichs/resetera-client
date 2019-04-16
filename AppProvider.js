import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  createStackNavigator,
  createAppContainer,
  NavigationActions
} from "react-navigation";

import { ThemeProvider } from "styled-components/native";
import {
  Provider as PaperThemeProvider,
  DefaultTheme
} from "react-native-paper";

import { Notifications } from "expo";

import registerForPush from "utils/push-notifications";
import Color from "utils/color-helper";

import { setPushToken } from "data/user/actions";
import { getPushToken } from "data/user/selectors";

import Home from "./src/screens/Home";
import Forum from "./src/screens/Forum";
import Thread from "./src/screens/Thread";
import ThemeToggle from "components/ThemeToggle";

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

class AppProvider extends React.PureComponent {
  constructor(props) {
    super(props);

    this.navigator = React.createRef();
  }

  _handleNotification = notification => {
    if (notification.data.type === "trending_thread") {
      this.navigator.current.dispatch(
        NavigationActions.navigate({
          routeName: "Thread",
          params: { threadId: notification.data.id, page: 1 }
        })
      );
    }
  };

  async componentDidMount() {
    const { pushToken, setPushToken } = this.props;
    const token = await registerForPush();
    setPushToken(token);

    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  render() {
    const { theme } = this.props;
    return (
      <PaperThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <AppContainer ref={this.navigator} />
        </ThemeProvider>
      </PaperThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  theme: UITheme[state.user.darkMode ? "dark" : "light"],
  pushToken: getPushToken(state)
});

const mapDispatchToProps = dispatch => ({
  setPushToken: bindActionCreators(setPushToken, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppProvider);
