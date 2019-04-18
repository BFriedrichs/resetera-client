import styled from "styled-components/native";

const DefaultText = styled.Text.attrs({
  selectable: true
})`
  color: ${props => props.theme.text};
  font-size: 15px;
`;

export default DefaultText;
