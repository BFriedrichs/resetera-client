import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

import { Switch } from "react-native-paper";
import { H2 } from "components/Title";

const Row = styled.View`
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.background.darken(0.2)};
  flex-flow: row;
  justify-content: space-between;
  align-content: center;
`;

const Name = styled(H2)`
  font-size: 22px;
`;

const SettingsRow = ({ name, isOn, onToggle }) => (
  <Row>
    <Name>{name}</Name>
    <Switch value={isOn} onValueChange={onToggle} />
  </Row>
);
export default SettingsRow;
