import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styled from "styled-components/native";

import { View, Text, TouchableWithoutFeedback } from "react-native";
import { getSettings } from "data/other/selectors";
import { toggleTheme } from "data/other/actions";

import { Ionicons } from "@expo/vector-icons";

const Wrapper = styled.View`
  margin-right: 16px;
`;

const ThemeToggle = ({ isDark, toggleTheme }) => (
  <Wrapper>
    <TouchableWithoutFeedback onPress={toggleTheme}>
      {isDark ? (
        <Ionicons name="ios-moon" size={24} color="white" />
      ) : (
        <Ionicons name="ios-sunny" size={24} color="white" />
      )}
    </TouchableWithoutFeedback>
  </Wrapper>
);

const mapStateToProps = state => ({
  isDark: getSettings(state).darkMode
});
const mapDispatchToProps = dispatch => ({
  toggleTheme: bindActionCreators(toggleTheme, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemeToggle);
