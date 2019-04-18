import React, { createRef } from "react";
import { View, SectionList } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { fetchPosts, fetchThread } from "data/thread/actions";

import { addToThreadCache } from "data/user/actions";

import {
  getForumIdFromThreadId,
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

const ThreadBackground = styled.View`
  background-color: ${props => props.theme.background};
  flex: 1;
  display: flex;
`;

const Title = styled(H1)`
  margin: 12px;
`;

const Bottom = styled(Pagination)`
  margin-bottom: 24px;
`;

class Thread extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title") || ""
  });

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
    const { posts, page, thread, threadId, scrollTo } = this.props;

    if (!thread || prevProps.threadId !== threadId || prevProps.page !== page) {
      if (
        !thread ||
        (thread && thread.meta.pages && page == thread.meta.pages) ||
        posts.length == 0
      ) {
        this.setState({ fetching: true }, async () => {
          await this.fetchNewPosts();
          this.setState({ initialFetch: true, fetching: false });
        });
      }
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
    this.setState({ fetching: true });
    navigation.navigate("Thread", { threadId: thread.id, page });
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
  const forumId = getForumIdFromThreadId(threadId)(state);
  const thread = selectThread(forumId, threadId)(state);

  const cachedThread = getCachedThread(threadId)(state);
  const page = ownProps.navigation.getParam(
    "page",
    (cachedThread && cachedThread.page) || 1
  );

  return {
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
