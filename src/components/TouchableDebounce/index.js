import React from "react";

import SafeComponent from "components/SafeComponent";
import { TouchableOpacity } from "react-native";

class TouchableDebounce extends SafeComponent {
  constructor(props) {
    super(props);

    this.state = {
      lastPress: 0
    };
  }

  onPress(evt) {
    const { onPress, timer = 500 } = this.props;
    const { lastPress } = this.state;

    const date = new Date();
    if (onPress && date - timer >= lastPress) {
      this.setState({ lastPress: date }, () => {
        onPress(evt);
      });
    }
  }

  render() {
    const {
      TouchableClass = TouchableOpacity,
      timer, // eslint-disable-line no-unused-vars
      onPress, // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;
    return <TouchableClass onPress={this.onPress.bind(this)} {...otherProps} />;
  }
}

export default TouchableDebounce;
