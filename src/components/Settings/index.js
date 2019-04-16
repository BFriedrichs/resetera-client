import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { View, Text, Animated, SafeAreaView } from "react-native";
import styled from "styled-components/native";

import { toggleSettingsDisplay, toggleTheme } from "data/user/actions";

import TouchableDebounce from "components/TouchableDebounce";
import { H1 } from "components/Title";

import SettingsRow from "./SettingsRow";

const Title = styled(H1)`
  font-size: 30px;
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
    const { settings } = this.props;
    this.setOpen(settings.open);
  }

  componentDidUpdate(prevProps) {
    const { settings } = this.props;

    if (settings.open !== prevProps.open) {
      this.setOpen(settings.open);
    }
  }

  render() {
    const { toggleSettingsDisplay, toggleTheme, settings } = this.props;
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
              name="Dark Mode"
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
  settings: state.user
});

const mapDispatchToProps = dispatch => ({
  toggleSettingsDisplay: bindActionCreators(toggleSettingsDisplay, dispatch),
  toggleTheme: bindActionCreators(toggleTheme, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
