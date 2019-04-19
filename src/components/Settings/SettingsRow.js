import React from "react";
import styled from "styled-components/native";

import { Switch } from "react-native-paper";
import { H2, H4 } from "components/Title";

const Row = styled.View`
  padding: ${props => props.padding || 16}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.background.darken(0.2)};
  align-content: center;
  align-items: center;
`;

const Main = styled.View`
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

const SettingsRow = ({
  name,
  description,
  enabledContent,
  isOn,
  onToggle,
  padding
}) => (
  <Row padding={padding}>
    <Main>
      <Wrapper>
        <Name>{name}</Name>
        {description ? <Description>{description}</Description> : null}
      </Wrapper>
      <Switch value={isOn} onValueChange={onToggle} />
    </Main>

    {isOn ? enabledContent : null}
  </Row>
);
export default SettingsRow;
