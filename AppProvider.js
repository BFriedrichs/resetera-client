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

import { Constants, Notifications } from "expo";
import { Platform } from "react-native";

import registerForPush from "utils/push-notifications";
import Color from "utils/color-helper";

import { setPushToken } from "data/user/actions";
import { getPushToken, getSettings } from "data/user/selectors";

import Home from "./src/screens/Home";
import Forum from "./src/screens/Forum";
import Thread from "./src/screens/Thread";

import SettingsToggle from "components/SettingsToggle";
import Settings from "components/Settings";
import LocalNotification from "components/LocalNotification";

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
      headerRight: <SettingsToggle />
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

class AppProvider extends React.PureComponent {
  constructor(props) {
    super(props);

    this.navigator = React.createRef();
    this.notification = React.createRef();
  }

  _handleNotification = notification => {
    const navigateThread = notification => {
      this.navigator.current.dispatch(
        NavigationActions.navigate({
          routeName: "Thread",
          params: { threadId: notification.data.id, page: 1 }
        })
      );
    };

    if (Platform.OS === "ios" && notification.origin === "received") {
      this.notification.current.showNotification({
        title: notification.data.title,
        text: notification.data.body,
        onPress: () => {
          navigateThread(notification);
        }
      });
    }
    if (notification.origin === "selected") {
      if (notification.data.type === "thread") {
        navigateThread(notification);
      }
    }
  };

  async componentDidMount() {
    const { setPushToken } = this.props;
    const token = await registerForPush();
    setPushToken(token);

    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  render() {
    const { theme } = this.props;
    const textStyle = {
      color: theme.text
    };
    return (
      <PaperThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <React.Fragment>
            <AppContainer ref={this.navigator} />
            <Settings />
            <LocalNotification
              duration={3500}
              notificationStyle={{
                paddingTop: 290 + Constants.statusBarHeight,
                backgroundColor: theme.background,
                borderColor: theme.background.darken(0.2)
              }}
              titleStyle={textStyle}
              textStyle={textStyle}
              ellipsizeTextStyle={textStyle}
              handleStyle={{
                backgroundColor: theme.background.adjust(1)
              }}
              ref={this.notification}
            />
          </React.Fragment>
        </ThemeProvider>
      </PaperThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  theme: UITheme[getSettings(state).darkMode ? "dark" : "light"],
  pushToken: getPushToken(state)
});

const mapDispatchToProps = dispatch => ({
  setPushToken: bindActionCreators(setPushToken, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppProvider);
