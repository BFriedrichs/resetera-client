import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { userSelector } from "data/user/selectors";
import { toggleSettingsDisplay } from "data/user/actions";

import IconButton from "./IconButton";

const mapStateToProps = state => ({
  open: userSelector(state).open
});
const mapDispatchToProps = dispatch => ({
  toggleSettingsDisplay: bindActionCreators(toggleSettingsDisplay, dispatch)
});

const SettingsButton = ({ toggleSettingsDisplay }) => (
  <IconButton name="md-settings" onPress={toggleSettingsDisplay} />
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsButton);
