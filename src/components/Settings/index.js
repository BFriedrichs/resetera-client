import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Animated, SafeAreaView } from "react-native";
import styled from "styled-components/native";

import {
  toggleSettingsDisplay,
  toggleTheme,
  markAsRead,
  setPushActive
} from "data/user/actions";
import { userSelector, getSettings, getPushToken } from "data/user/selectors";

import TouchableDebounce from "components/TouchableDebounce";
import { H1 } from "components/Title";

import SettingsRow from "./SettingsRow";

const Title = styled(H1)`
  margin-bottom: 16px;
`;

const SlidingView = styled(Animated.View)`
  height: 100%;
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
`;

const Fill = styled(TouchableDebounce)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Content = styled.View`
  height: 100%;
  width: 75%;
  background-color: ${props => props.theme.background};

  padding: 16px;
`;

class Settings extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      width: new Animated.Value(0)
    };
  }

  setOpen(open) {
    if (open) {
      Animated.spring(this.state.width, {
        toValue: 1,
        duration: 300,
        overshootClamping: true
      }).start();
    } else {
      Animated.spring(this.state.width, {
        toValue: 0,
        duration: 300
      }).start();
    }
  }

  componentDidMount() {
    this.setOpen(this.props.open);
  }

  componentDidUpdate(prevProps) {
    const { open } = this.props;

    if (open !== prevProps.open) {
      this.setOpen(open);
    }
  }

  render() {
    const {
      toggleSettingsDisplay,
      toggleTheme,
      setPushActive,
      settings,
      pushToken,
      markAsRead
    } = this.props;
    const { width } = this.state;

    return (
      <SlidingView
        style={{
          left: width.interpolate({
            inputRange: [0, 1],
            outputRange: ["-100%", "0%"]
          })
        }}
      >
        <Fill onPress={toggleSettingsDisplay} />
        <Content>
          <SafeAreaView>
            <Title>Settings</Title>
            <SettingsRow
              name="Thread Updates"
              description="Receive push notifications about currently trending threads."
              isOn={settings.pushActive}
              onToggle={isOn => {
                setPushActive(pushToken, isOn);
              }}
            />
            <SettingsRow
              name="Mark As Read"
              description="Visited threads will be grayed out."
              isOn={settings.markAsRead}
              onToggle={markAsRead}
            />
            <SettingsRow
              name="Dark Mode"
              description="Zzz."
              isOn={settings.darkMode}
              onToggle={toggleTheme}
            />
          </SafeAreaView>
        </Content>
      </SlidingView>
    );
  }
}

const mapStateToProps = state => ({
  settings: getSettings(state),
  open: userSelector(state).open,
  pushToken: getPushToken(state)
});

const mapDispatchToProps = dispatch => ({
  toggleSettingsDisplay: bindActionCreators(toggleSettingsDisplay, dispatch),
  toggleTheme: bindActionCreators(toggleTheme, dispatch),
  setPushActive: bindActionCreators(setPushActive, dispatch),
  markAsRead: bindActionCreators(markAsRead, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
