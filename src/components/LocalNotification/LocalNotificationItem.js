import React, { Component } from "react";
import {
  PanResponder,
  View,
  Platform,
  LayoutAnimation,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { BlurView, Constants } from "expo";

import styled from "styled-components/native";
import { H2, H3, H4 } from "components/Title";

import { Icon } from "assets";

const BackBlur = styled(BlurView).attrs(props => ({
  tint: props.theme.dark ? "dark" : "light",
  intensity: props.isExpanded ? 30 : 0
}))`
  position: absolute;
  left: 0;
  top: 0;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

const Wrapper = styled.View`
  z-index: ${props => (props.isExpanded ? 100 : 10)};
  position: absolute;
  top: 0;
  left: 0px;
  right: 0px;
`;

const AnimatedView = styled.View`
  flex: 1;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.4);
`;

const InnerView = styled(BlurView).attrs(props => ({
  tint: props.theme.dark ? "dark" : "light",
  intensity: props.isExpanded ? 0 : 90
}))`
  margin-top: ${props => props.topPadding}px;
  margin-left: 8px;
  margin-right: 8px;
  border-radius: 12px;
`;

const NotificationView = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: ${props =>
    props.isExpanded ? props.theme.background : "transparent"};
`;

const expandedStyle = props => `
  padding: 16px 12px 16px 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${props.theme.background.adjust(0.2)};
  margin-bottom: 12px;
`;

const Status = styled.View`
  padding: 12px 12px 0 12px;
  flex-flow: row;
  justify-content: space-between;
  align-content: center;
  margin-bottom: 8px;
  ${props => (props.isExpanded ? expandedStyle(props) : "")};
`;

const LogoIcon = styled.Image`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  margin-right: 8px;
`;

const AppName = styled(H4)``;

const Time = styled(H4)`
  margin-right: 4px;
`;

const TextWrapper = styled.View`
  padding: 0 12px 12px 12px;
  flex: 1;
  overflow: hidden;
  flex-wrap: wrap;
`;

const Title = styled(H3).attrs({ bold: true })`
  justify-content: flex-end;
`;

const Body = styled(H3)`
  padding-top: 2px;
  flex-wrap: wrap;
`;

const ActionButton = styled(BlurView).attrs(props => ({
  tint: props.theme.dark ? "dark" : "light",
  intensity: 70
}))`
  opacity: ${props => (props.visible ? 1 : 0)};
  height: 56px;
  margin: 10px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(H2)`
  color: ${props => props.theme.text.alpha(0.8)};
`;

const statusBarHeight = () => {
  if (Platform.OS === "ios") {
    return 40;
  }
  return Constants.statusBarHeight;
};

class LocalNotificationItem extends Component {
  constructor(props) {
    super(props);

    this.fullTextHeight = null;
    this.textHeightSetCurrentTouch = false;

    this.state = {
      topMargin: -200,
      isShowing: false,
      isExpanded: false,
      isFurtherExpanded: false,
      draggedHeight: 0
    };

    this.onLayout = this.onLayout.bind(this);
    this.hideNotification = this.hideNotification.bind(this);

    this.init();
  }

  init() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,
      onStartShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminate: () => {},
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 100 || Math.abs(gestureState.dy) > 1,
      onPanResponderGrant: () => {
        this.textHeightSetCurrentTouch = false;
        clearTimeout(this.timeout);
      },
      onPanResponderMove: (evt, gestureState) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({
          draggedHeight: gestureState.dy
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Press only works if not expanded
        // need to press button otherwise
        if (
          !this.state.isFurtherExpanded &&
          this.isPress(gestureState.dy, gestureState.dx)
        ) {
          this.props.onNotificationPress(this.props.itemId);
          this.hideNotification();
        } else {
          if (this.state.draggedHeight < -10) {
            this.hideNotification();
          } else {
            if (this.state.draggedHeight > 100) {
              LayoutAnimation.easeInEaseOut();
              if (this.state.isExpanded || this.state.draggedHeight > 300) {
                this.setState({
                  draggedHeight: 0,
                  isExpanded: true,
                  isFurtherExpanded: true
                });
              } else {
                this.setState({
                  draggedHeight: 0,
                  isExpanded: true
                });
              }
            } else {
              if (!this.state.isExpanded) {
                LayoutAnimation.easeInEaseOut();
                this.setState({
                  draggedHeight: 0
                });
                this.timeout = setTimeout(
                  this.hideNotification,
                  this.props.duration
                );
              }
            }
          }
        }
      }
    });
  }

  componentDidMount() {
    this.timeout = setTimeout(this.hideNotification, this.props.duration);
  }

  isPress(y, x) {
    return Math.abs(y) < 4 && Math.abs(x) < 4;
  }

  hideNotification() {
    const config = {
      ...LayoutAnimation.Presets.linear,
      duration: 250
    };
    LayoutAnimation.configureNext(config, () => {
      this.props.onNotificationHide(this.props.itemId);
    });
    this.setState({ topMargin: -200, isFurtherExpanded: false });
  }

  onLayout() {
    if (this.state.isShowing || this.state.topMargin === 0) return;

    LayoutAnimation.easeInEaseOut();
    this.setState({
      topMargin: 0,
      isShowing: true
    });
  }

  render() {
    const { actionText } = this.props;
    const {
      draggedHeight,
      topMargin,
      isExpanded,
      isFurtherExpanded
    } = this.state;
    const { height, width } = Dimensions.get("window");

    return (
      <Wrapper isExpanded={isExpanded}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideNotification();
          }}
        >
          <BackBlur isExpanded={isExpanded} width={width} height={height} />
        </TouchableWithoutFeedback>

        <AnimatedView
          {...this._panResponder.panHandlers}
          style={{
            marginTop: topMargin + Math.min(draggedHeight, draggedHeight / 4)
          }}
        >
          <InnerView
            isExpanded={isExpanded}
            topPadding={statusBarHeight()}
            style={this.props.notificationStyle}
          >
            <NotificationView isExpanded={isExpanded}>
              <Status isExpanded={isExpanded}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <LogoIcon source={Icon} />
                  <AppName>{Constants.manifest.name.toUpperCase()}</AppName>
                </View>
                <Time>now</Time>
              </Status>
              <TextWrapper>
                <View onLayout={this.onLayout}>
                  {this.props.title && (
                    <Title ellipsizeMode="tail" numberOfLines={1}>
                      {this.props.title}
                    </Title>
                  )}
                  <Body
                    ellipsizeMode="tail"
                    numberOfLines={isExpanded ? 0 : 2}
                    style={{
                      height: isExpanded ? "auto" : 38
                    }}
                  >
                    {this.props.text}
                  </Body>
                </View>
              </TextWrapper>
            </NotificationView>
          </InnerView>
        </AnimatedView>
        <TouchableOpacity
          onPress={() => {
            this.props.onNotificationPress(this.props.itemId);
            this.hideNotification();
          }}
          activeOpacity={0.8}
        >
          <ActionButton visible={isFurtherExpanded}>
            <ButtonText>
              {(actionText || "View Content").toUpperCase()}
            </ButtonText>
          </ActionButton>
        </TouchableOpacity>
      </Wrapper>
    );
  }
}

export default LocalNotificationItem;
