import React from "react";
import styled from "styled-components/native";

import { Switch } from "react-native-paper";
import { H2, H4 } from "components/Title";

const Row = styled.View`
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.background.darken(0.2)};
  flex-flow: row;
  justify-content: space-between;
  align-content: center;
  align-items: center;
`;

const Name = styled(H2)``;

const Description = styled(H4)``;

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
