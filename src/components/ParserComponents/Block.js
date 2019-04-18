import styled from "styled-components/native";

const Block = styled.View`
  background-color: ${props => props.theme.background};
  border-color: ${props => props.theme.background.darken(0.5)};
  border-left-width: 2px;
  padding: 12px;
  margin: 8px 0;
`;

export default Block;
