import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { List, TouchableRipple } from "react-native-paper";

import { H3, H4 } from "components/Title";

const ListItemWrapper = styled.View`
  padding: 24px 32px;
  justify-content: center;
  border-color: ${props => props.theme.background.darken(0.2)};
  border-bottom-width: ${props => (props.divider ? 1 : 0)};
`;

const ListItem = ({ title, subtitle, divider, onPress, ...props }) => (
  <TouchableRipple rippleColor="rgba(0, 0, 0, .8)" onPress={onPress}>
    <ListItemWrapper divider={divider} {...props}>
      <H3>{title}</H3>
      {subtitle ? <H4>{subtitle}</H4> : null}
    </ListItemWrapper>
  </TouchableRipple>
);

export default ListItem;
