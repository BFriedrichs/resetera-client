import React, { Component } from "react";
import { View } from "react-native";
import LocalNotificationItem from "./LocalNotificationItem";

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
  }

  showNotification(notification) {
    const id = Math.floor(Math.random() * 1000) + Date.now();
    this.setState({
      notifications: [...this.state.notifications, { ...notification, id }]
    });
  }

  render() {
    const {
      duration = 3500,
      textStyle,
      titleStyle,
      handleStyle,
      notificationStyle
    } = this.props;

    return (
      <View style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        {this.state.notifications.map((item, _) => (
          <LocalNotificationItem
            key={item.id}
            itemId={item.id}
            title={item.title}
            text={item.text}
            actionText={item.actionText}
            duration={item.duration || duration}
            textStyle={textStyle}
            titleStyle={titleStyle}
            handleStyle={handleStyle}
            notificationStyle={notificationStyle}
            onNotificationPress={this.onNotificationPress}
            onNotificationHide={this.hideNotification}
          />
        ))}
      </View>
    );
  }
}

export default LocalNotification;
