import React from "react";
import styled from "styled-components/native";
import { Button, Card, Surface } from "react-native-paper";

const CardBack = styled(Surface).attrs(props => ({
  elevation: props.elevation || 3
}))`
  padding: 16px;
  background-color: #fff;
  border-radius: 16px;
  elevation: ${props => props.elevation || 3};
`;

const BetterCard = ({
  contentStyle,
  children,
  actions,
  title,
  ...otherProps
}) => (
  <CardBack {...otherProps}>
    {title ? <Card.Title title={title} /> : null}
    <Card.Content style={contentStyle}>{children}</Card.Content>
    {actions ? (
      <Card.Actions>
        {actions.map((a, i) => (
          <Button key={i} onPress={a.onPress}>
            {a.name}
          </Button>
        ))}
      </Card.Actions>
    ) : null}
  </CardBack>
);

export default BetterCard;
