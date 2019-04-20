import React from "react";
import styled from "styled-components/native";
import { Button } from "react-native-paper";

import SafeComponent from "components/SafeComponent";

const BGView = styled.View`
  margin: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

const HiddenView = styled.View`
  display: ${props => (props.visible ? "flex" : "none")};
  padding: 8px;
`;

class Spoiler extends SafeComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  render() {
    return (
      <BGView>
        <Button
          mode="contained"
          onPress={() => {
            this.setState({ visible: !this.state.visible });
          }}
        >
          Spoiler
        </Button>
        <HiddenView visible={this.state.visible} {...this.props} />
      </BGView>
    );
  }
}

export default Spoiler;
