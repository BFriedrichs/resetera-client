import React, { createRef } from "react";
import { View, SectionList, ActionSheetIOS, Platform } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { connectActionSheet } from "@expo/react-native-action-sheet";
import { WebBrowser } from "expo";

import { BASE_URL } from "data/constants";
import { fetchPosts, fetchThread } from "data/thread/actions";
import { addToThreadCache } from "data/user/actions";

import {
  getForumFromThreadId,
  selectPostsFromThread,
  selectThread
} from "data/thread/selectors";
import { getCachedThread } from "data/user/selectors";

import styled from "styled-components/native";
import PostListItem from "components/PostListItem";
import Pagination from "components/Pagination";
import { H1 } from "components/Title";
import Loader from "components/Loader";
import Poll from "components/Poll";

import SafeComponent from "components/SafeComponent";
import { SettingsButton, IconButton } from "components/IconButton";

const ThreadBackground = styled.View`
  background-color: ${props => props.theme.background};
  flex: 1;
  display: flex;
`;

const HeaderImage = styled.Image`
  flex: 1;
  opacity: 0.5;
`;

const Title = styled(H1)`
  margin: 12px;
`;

const Bottom = styled(Pagination)`
  margin-bottom: 24px;
`;

@connectActionSheet
class Thread extends SafeComponent {
  static navigationOptions = ({ navigation }) => {
    let nav = {
      title: navigation.getParam("title") || ""
    };

    const headerImage = navigation.getParam("headerImage", null);
    if (headerImage) {
      nav["headerBackground"] = (
        <HeaderImage
          resizeMode="cover"
          source={{ uri: BASE_URL + headerImage }}
        />
      );
    }

    const tUrl = navigation.getParam("threadUrl", null);
    if (tUrl) {
      const showActionSheetWithOptions = navigation.getParam(
        "showActionSheetWithOptions"
      );
      const threadUrl = tUrl.startsWith(BASE_URL) ? tUrl : BASE_URL + tUrl;

      let options = ["Cancel", "Open Thread in Safari"];

      if (Platform.OS === "ios") {
        options.push("Share Thread");
      }

      const actions = {
        options: options,
        cancelButtonIndex: 0,
        title: "Thread Options",
        message: threadUrl
      };

      const handleAction = buttonIndex => {
        switch (buttonIndex) {
          case 1:
            WebBrowser.openBrowserAsync(threadUrl);
            break;
          case 2:
            ActionSheetIOS.showShareActionSheetWithOptions(
              {
                url: threadUrl
              },
              err => {
                console.error(err);
              },
              () => {}
            );
            break;
        }
      };

      nav["headerRight"] = (
        <React.Fragment>
          <IconButton
            name="ios-share-alt"
            onPress={() => {
              showActionSheetWithOptions(actions, handleAction);
            }}
          />
          <SettingsButton />
        </React.Fragment>
      );
    }

    return nav;
  };

  constructor(props) {
    super(props);

    this.state = {
      initialFetch: !!props.cache,
      fetching: true
    };

    this.scrollView = createRef();
  }

  async fetchNewPosts() {
    const { addToThreadCache, fetchPosts, threadId, page } = this.props;
    await fetchPosts(threadId, page);

    addToThreadCache(threadId, page);
  }

  async componentDidMount() {
    await this.fetchNewPosts();
    this.setState({ initialFetch: true, fetching: false });
  }

  componentDidUpdate(prevProps) {
    const {
      posts,
      page,
      thread,
      threadId,
      scrollTo,
      showActionSheetWithOptions
    } = this.props;

    if (this.state.initialFetch) {
      const title = this.props.navigation.getParam("title", null);
      if (!title) {
        this.props.navigation.setParams({ title: this.props.forum.meta.name });
      }

      const headerImage = this.props.navigation.getParam("headerImage", null);
      if (thread.meta.img_url && !headerImage) {
        this.props.navigation.setParams({ headerImage: thread.meta.img_url });
      }

      const threadUrl = this.props.navigation.getParam("threadUrl", null);
      if (thread.meta.url && !threadUrl) {
        this.props.navigation.setParams({
          threadUrl: thread.meta.url,
          showActionSheetWithOptions
        });
      }
    }

    if (
      (!thread || prevProps.threadId !== threadId || prevProps.page !== page) &&
      ((thread && thread.meta.pages && page == thread.meta.pages) ||
        posts.length == 0)
    ) {
      this.setState({ fetching: true }, async () => {
        await this.fetchNewPosts();
        this.setState({ initialFetch: true, fetching: false });
      });
    }

    if (this.scrollView.current && scrollTo && posts.length > 0) {
      const ids = posts.map(e => e.id);
      const index = ids.indexOf(parseInt(scrollTo));
      const listRef = this.scrollView.current._wrapperListRef._listRef;
      const avgHeight = listRef._averageCellLength;

      listRef.scrollToOffset({ offset: avgHeight * index, animated: true });
    }
  }

  _keyExtractor(post) {
    return `${post.id}`;
  }

  loadPage(page) {
    if (page == -1) {
      return;
    }
    const { navigation, thread } = this.props;
    this.setState({ fetching: true }, () => {
      navigation.navigate("Thread", { threadId: thread.id, page });
    });
  }

  render() {
    const { posts, thread, page } = this.props;
    const { initialFetch, fetching } = this.state;
    return (
      <ThreadBackground>
        {thread && initialFetch ? (
          <React.Fragment>
            <SectionList
              ref={this.scrollView}
              onRefresh={() => {
                this.setState({ fetching: true }, async () => {
                  await this.fetchNewPosts();
                  this.setState({ fetching: false });
                });
              }}
              refreshing={fetching}
              sections={[{ title: thread.meta.name, data: posts }]}
              keyExtractor={this._keyExtractor}
              renderItem={({ item }) => <PostListItem item={item} />}
              stickySectionHeadersEnabled={false}
              ListFooterComponent={
                <Bottom
                  loadPage={this.loadPage.bind(this)}
                  page={page}
                  pages={thread.meta.pages}
                />
              }
              renderSectionHeader={({ section: { title } }) => (
                <View>
                  <React.Fragment>
                    <Title>{title}</Title>
                    {thread.poll ? <Poll poll={thread.poll} /> : null}
                  </React.Fragment>

                  <Bottom
                    loadPage={this.loadPage.bind(this)}
                    page={page}
                    pages={thread.meta.pages}
                  />
                </View>
              )}
            />
          </React.Fragment>
        ) : (
          <Loader size="large" />
        )}
      </ThreadBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const threadId = ownProps.navigation.getParam("threadId");
  const postId = ownProps.navigation.getParam("postId");
  const forum = getForumFromThreadId(threadId)(state);
  const thread = selectThread(forum && forum.id, threadId)(state);

  const cachedThread = getCachedThread(threadId)(state);
  const page = ownProps.navigation.getParam(
    "page",
    (cachedThread && cachedThread.page) || 1
  );

  return {
    forum: forum,
    thread: thread,
    threadId: threadId,
    posts: selectPostsFromThread(threadId, page)(state),
    page: page,
    cache: cachedThread,
    scrollTo: parseInt(postId)
  };
};

const mapDispatchToProps = dispatch => ({
  fetchPosts: bindActionCreators(fetchPosts, dispatch),
  fetchThread: bindActionCreators(fetchThread, dispatch),
  addToThreadCache: bindActionCreators(addToThreadCache, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);
