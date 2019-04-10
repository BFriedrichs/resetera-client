import React from "react";
import { ActivityIndicator } from "react-native-paper";

import styled from "styled-components/native";

const LoadingWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Loader = ({ wrapperProps, ...props }) => (
  <LoadingWrapper {...wrapperProps}>
    <ActivityIndicator animating={true} {...props} />
  </LoadingWrapper>
);

export default Loader;
