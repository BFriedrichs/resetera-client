import React from "react";
import { Platform, ActionSheetIOS, Dimensions, Animated } from "react-native";
import styled from "styled-components/native";
import { Surface } from "react-native-paper";

import BlurOverlay from "components/BlurOverlay";

const CardView = styled(Surface).attrs({
  elevation: 3
})`
  padding: 48px 16px 16px 16px;
  margin: 0 8px;
  border-radius: 16px;
  background: #fff;
  elevation: 3;
`;

class PeekView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalPressed: false,
      scale: new Animated.Value(0.5)
    };
  }

  showActions() {
    const { actions, onAction } = this.props;

    if (Platform.OS === "ios") {
      const resetAction = buttonIndex => {
        onAction(buttonIndex);
        this.setState({ modalPressed: false });
      };
      ActionSheetIOS.showActionSheetWithOptions(actions, resetAction);
    }
  }

  componentDidUpdate(prevProps) {
    const { delay, actions, onAction, visible } = this.props;
    const { modalPressed } = this.state;
    const saveDelay = delay || 1000;
    const wasVisible = prevProps.visible;
    if (!wasVisible && visible && !modalPressed) {
      Animated.timing(this.state.scale, {
        toValue: 1,
        duration: 200
      }).start();
      if (actions && onAction) {
        setTimeout(() => {
          if (this.props.visible) {
            this.setState({ modalPressed: true });
            this.showActions();
          } else {
            Animated.timing(this.state.scale, {
              toValue: 0.5,
              duration: 200
            }).start();
          }
        }, saveDelay);
      }
    }
    if (!visible && !modalPressed) {
      Animated.timing(this.state.scale, {
        toValue: 0.5,
        duration: 200
      }).start();
    }
  }

  render() {
    const { modalPressed, scale } = this.state;
    const { visible, children } = this.props;
    const modalVisible = visible || modalPressed;
    const dims = Dimensions.get("window");

    return (
      <BlurOverlay visible={modalVisible}>
        <Animated.View
          style={{
            width: dims.width,
            height: dims.height,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scaleX: scale }, { scaleY: scale }]
          }}
        >
          <CardView>{children}</CardView>
        </Animated.View>
      </BlurOverlay>
    );
  }
}

export default PeekView;
