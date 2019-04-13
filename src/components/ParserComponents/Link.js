import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { withNavigation } from "react-navigation";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchThread } from "data/thread/actions";
import { WebBrowser } from "expo";

import { BASE_URL } from "data/constants";

const LinkText = styled.Text`
  color: #6face5;
`;

const resolveGoto = href => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + href)
      .then(e => {
        resolve(e.url);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const Link = props => {
  const { internal, textOnly } = props;
  const TheClass = textOnly ? LinkText : TouchableOpacity;
  if (internal) {
    const {
      target,
      id,
      href,
      page,
      navigation,
      fetchThread,
      ...others
    } = props;
    return (
      <TheClass
        onPress={async () => {
          switch (target) {
            case "thread":
              const gotoPage = page || 1;
              navigation.push("Thread", { threadId: id, page: gotoPage });
              break;
            case "forum":
              navigation.push("Forum", { forumId: id });
              break;
            case "post":
              resolveGoto(href)
                .then(url => {
                  const threadRegex = /\.[0-9]*\//g;
                  const pageRegex = /page-[0-9]*#/g;

                  const threadMatch = url.match(threadRegex)[0];
                  const threadId = threadMatch.substring(
                    1,
                    threadMatch.length - 1
                  );

                  const pageMatch = url.match(pageRegex);
                  let page = 1;
                  if (pageMatch) {
                    page = pageMatch[0].substring(5, pageMatch[0].length - 1);
                  }
                  navigation.push("Thread", { threadId, page, postId: id });
                })
                .catch(err => {
                  console.log(err);
                });
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
