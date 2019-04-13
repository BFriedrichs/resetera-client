import React from "react";
import styled from "styled-components/native";

const DefaultText = styled.Text.attrs({
  selectable: true
})`
  color: ${props => props.theme.text};
`;

export default DefaultText;
