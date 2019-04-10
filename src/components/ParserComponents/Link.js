import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { withNavigation } from "react-navigation";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchThread } from "data/thread/actions";
import { WebBrowser } from "expo";

const LinkText = styled.Text`
  color: blue;
`;

const Link = props => {
  const { internal, textOnly } = props;

  const TheClass = textOnly ? LinkText : TouchableOpacity;
  if (internal) {
    const { target, id, navigation, fetchThread, ...others } = props;
    return (
      <TheClass
        onPress={async () => {
          switch (target) {
            case "thread":
              navigation.push("Thread", { threadId: id });
              break;
            case "forum":
              navigation.push("Forum", { forumId: id });
              break;
          }
        }}
        {...others}
      />
    );
  } else {
    const { href, ...others } = props;
    return (
      <TheClass
        onPress={() => {
          WebBrowser.openBrowserAsync(href);
        }}
        {...props}
      />
    );
  }
};

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = dispatch => ({
  fetchThread: bindActionCreators(fetchThread, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Link));
