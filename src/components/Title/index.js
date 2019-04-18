import styled from "styled-components/native";

export const BaseTitle = styled.Text`
  color: ${props => props.color || props.theme.text};
  font-weight: ${props => (props.bold ? "bold" : "normal")};
`;

export const H1 = styled(BaseTitle)`
  font-weight: bold;
  font-size: 34px;
`;

export const H2 = styled(BaseTitle)`
  font-size: 17px;
`;

export const H3 = styled(BaseTitle)`
  font-size: 15px;
`;

export const H4 = styled(BaseTitle)`
  font-size: 13px;
`;
