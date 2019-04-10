import React from "react";
import { View, Modal, Dimensions } from "react-native";
import { BlurView } from "expo";
import styled from "styled-components/native";

import { Card, Button } from "react-native-paper";
import BetterCard from "components/BetterCard";

const Centered = styled.View`
  justify-content: center;
  align-items: center;
`;

class BlurOverlay extends React.PureComponent {
  render() {
    const {
      contentInCard,
      visible,
      children,
      intensity,
      ...otherProps
    } = this.props;
    const dims = Dimensions.get("window");

    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={visible}
        {...otherProps}
      >
        <View>
          <BlurView
            style={{ position: "absolute" }}
            intensity={intensity || 50}
            tint={"dark"}
          >
            <View
              style={{
                width: dims.width,
                height: dims.height
              }}
            />
          </BlurView>
          <Centered
            style={{
              width: dims.width,
              height: dims.height
            }}
          >
            {contentInCard ? (
              <BetterCard title="Pick a page">{children}</BetterCard>
            ) : (
              children
            )}
          </Centered>
        </View>
      </Modal>
    );
  }
}

export default BlurOverlay;
