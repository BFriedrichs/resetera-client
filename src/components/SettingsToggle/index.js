import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styled from "styled-components/native";

import { Animated, View, Text, TouchableWithoutFeedback } from "react-native";
import { getSettings } from "data/user/selectors";
import { toggleSettingsDisplay } from "data/user/actions";

import { Ionicons } from "@expo/vector-icons";

const Wrapper = styled(Animated.View)`
  padding: 4px;
  margin-right: 16px;
`;

class SettingsToggle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bounce: new Animated.Value(1)
    };
  }

  onClick() {
    const { toggleSettingsDisplay } = this.props;
    toggleSettingsDisplay();
    Animated.sequence([
      Animated.timing(this.state.bounce, {
        toValue: 0.7,
        duration: 100
      }),
      Animated.spring(this.state.bounce, {
        toValue: 1,
        duration: 100
      })
    ]).start();
  }

  render() {
    const { open } = this.props;
    const { bounce } = this.state;

    return (
      <TouchableWithoutFeedback onPress={this.onClick.bind(this)}>
        <Wrapper
          style={{
            transform: [{ scaleX: bounce }, { scaleY: bounce }]
          }}
        >
          <Ionicons name="md-settings" size={24} color="white" />
        </Wrapper>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  open: getSettings(state).open
});
const mapDispatchToProps = dispatch => ({
  toggleSettingsDisplay: bindActionCreators(toggleSettingsDisplay, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsToggle);
