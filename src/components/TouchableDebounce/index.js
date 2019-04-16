import React from "react";

import { TouchableOpacity } from "react-native";

class TouchableDebounce extends React.PureComponent {
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
      timer,
      onPress,
      ...otherProps
    } = this.props;
    return <TouchableClass onPress={this.onPress.bind(this)} {...otherProps} />;
  }
}

export default TouchableDebounce;
