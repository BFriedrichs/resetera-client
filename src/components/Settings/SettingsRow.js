import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { Switch } from "react-native-paper";
import { BaseTitle, H2 } from "components/Title";

const Row = styled.View`
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.background.darken(0.2)};
  flex-flow: row;
  justify-content: space-between;
  align-content: center;
  align-items: center;
`;

const Name = styled(H2)`
  font-size: 22px;
`;

const Description = styled(BaseTitle)``;

const Wrapper = styled.View`
  width: 75%;
`;

const SettingsRow = ({ name, description, isOn, onToggle }) => (
  <Row>
    <Wrapper>
      <Name>{name}</Name>
      {description ? <Description>{description}</Description> : null}
    </Wrapper>
    <Switch value={isOn} onValueChange={onToggle} />
  </Row>
);
export default SettingsRow;
