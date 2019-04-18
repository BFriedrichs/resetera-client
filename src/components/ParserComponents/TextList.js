import React from "react";
import DefaultText from "./DefaultText";
import styled from "styled-components/native";

const List = styled.View`
  margin-bottom: 16px;
`;

const ListItem = styled.View`
  flex-flow: row;
  margin-bottom: 2px;
`;

const Num = styled(DefaultText)`
  width: ${props => props.len}px;
`;

const Wrap = styled.View`
  flex-shrink: 1;
`;

const widthGenerator = type => len => {
  switch (type) {
    case "ordered":
      return len * 15;
    default:
      return 15;
  }
};

const prefixGenerator = type => i => {
  switch (type) {
    case "ordered":
      return `${i + 1}.`;
    default:
      return `•`;
  }
};

const TextList = ({ children, type }) => (
  <List>
    {children.map((e, i) => (
      <ListItem key={i}>
        <Num len={widthGenerator(type)(children.length.toString().length)}>
          {prefixGenerator(type)(i)}
        </Num>
        <Wrap>{e}</Wrap>
      </ListItem>
    ))}
  </List>
);

export default TextList;
