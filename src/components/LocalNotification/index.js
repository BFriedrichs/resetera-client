import React, { Component } from "react";
import {
  PanResponder,
  View,
  Text,
  StyleSheet,
  Platform,
  LayoutAnimation,
  StatusBar
} from "react-native";

class LocalNotificationItem extends Component {
  constructor(props) {
    super(props);

    this.fullTextHeight = null;
    this.textHeightSetCurrentTouch = false;

    this.state = {
      topMargin: -180,
      isShowing: false,
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
        this.setState({
          draggedHeight: gestureState.dy
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this.isPress(gestureState.dy, gestureState.dx)) {
          this.props.onNotificationPress(this.props.itemId);
          this.hideNotification();
        } else {
          if (this.state.draggedHeight < -10) {
            this.hideNotification();
          } else {
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
    this.setState({ topMargin: -200 });
  }

  onLayout() {
    if (this.state.isShowing) return;

    LayoutAnimation.easeInEaseOut();
    this.setState({
      topMargin: 0,
      isShowing: true
    });
  }

  render() {
    const { draggedHeight } = this.state;
    const { numberOfTextLines } = this.props;

    const lines = Math.max(numberOfTextLines, Math.ceil(draggedHeight / 16));

    return (
      <View style={styles.wrapper}>
        <View
          {...this._panResponder.panHandlers}
          style={[
            styles.animatedView,
            {
              marginTop:
                -260 +
                (draggedHeight < 180 ? draggedHeight : 180) +
                this.state.topMargin -
                Math.min(180, draggedHeight)
            }
          ]}
        >
          <View style={[styles.innerView, this.props.notificationStyle]}>
            <View style={[styles.textWrapper]}>
              <View onLayout={this.onLayout}>
                {this.props.title && (
                  <Text
                    style={[styles.title, this.props.titleStyle]}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {this.props.title}
                  </Text>
                )}
                <Text
                  style={[
                    styles.text,
                    this.props.textStyle,
                    {
                      height: Math.min(180, 48 + draggedHeight)
                    }
                  ]}
                  ellipsizeMode="tail"
                >
                  {this.props.text}
                </Text>
              </View>
            </View>
            <View style={[styles.handle, this.props.handleStyle]} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: -1,
    right: -1,
    backgroundColor: "transparent"
  },
  animatedView: {
    backgroundColor: "transparent",
    flex: 1
  },
  innerView: {
    backgroundColor: "white",
    borderColor: "#ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    paddingTop: 300,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: "flex-end"
  },
  title: {
    height: 24,
    paddingTop: 6,
    color: "black",
    fontWeight: "bold",
    paddingHorizontal: 8,
    justifyContent: "flex-end",
    fontSize: 16
  },
  textWrapper: {
    backgroundColor: "transparent",
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
    overflow: "hidden"
  },
  text: {
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingHorizontal: 8,
    color: "#333"
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,.2)",
    marginBottom: 6,
    marginTop: 4,
    alignSelf: "center"
  }
});

class LocalNotification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: []
    };

    this.hideNotification = this.hideNotification.bind(this);
    this.onNotificationPress = this.onNotificationPress.bind(this);
  }

  onNotificationPress(id) {
    const index = this.state.notifications.findIndex(item => item.id === id);

    const noti = this.state.notifications[index];
    noti && noti.onPress && noti.onPress(noti);
  }

  hideNotification(id) {
    const index = this.state.notifications.findIndex(item => item.id === id);

    const noti = this.state.notifications[index];
    noti && noti.onHide && noti.onHide(noti);

    const newNotifications = this.state.notifications.slice();
    newNotifications.splice(index, 1);
    this.setState({
      notifications: newNotifications
    });

    newNotifications.length === 0 &&
      Platform.OS === "ios" &&
      StatusBar.setHidden(false, true);
  }

  showNotification(notification) {
    const id = Math.floor(Math.random() * 1000) + Date.now();
    this.setState({
      notifications: [...this.state.notifications, { ...notification, id }]
    });

    Platform.OS === "ios" && StatusBar.setHidden(true, false);
  }

  render() {
    const {
      duration = 3500,
      textStyle,
      titleStyle,
      handleStyle,
      notificationStyle,
      numberOfTextLines = 2
    } = this.props;

    return (
      <View style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        {this.state.notifications.map((item, _) => (
          <LocalNotificationItem
            key={item.id}
            itemId={item.id}
            title={item.title}
            text={item.text}
            duration={duration}
            textStyle={textStyle}
            titleStyle={titleStyle}
            handleStyle={handleStyle}
            notificationStyle={notificationStyle}
            onNotificationPress={this.onNotificationPress}
            onNotificationHide={this.hideNotification}
            numberOfTextLines={numberOfTextLines}
          />
        ))}
      </View>
    );
  }
}

export default LocalNotification;
