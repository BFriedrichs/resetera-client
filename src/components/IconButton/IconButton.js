import React from "react";
import styled from "styled-components/native";

import { Animated, TouchableWithoutFeedback } from "react-native";

import { Ionicons } from "@expo/vector-icons";

const Wrapper = styled(Animated.View)`
  padding: 4px;
  margin-right: 16px;
`;

class IconButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bounce: new Animated.Value(1)
    };
  }

  onClick() {
    const { onPress } = this.props;
    onPress();
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
    const { name } = this.props;
    const { bounce } = this.state;

    return (
      <TouchableWithoutFeedback onPress={this.onClick.bind(this)}>
        <Wrapper
          style={{
            transform: [{ scaleX: bounce }, { scaleY: bounce }]
          }}
        >
          <Ionicons name={name} size={24} color="white" />
        </Wrapper>
      </TouchableWithoutFeedback>
    );
  }
}

export default IconButton;
