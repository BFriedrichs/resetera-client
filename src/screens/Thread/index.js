import React from "react";
import { View, SectionList } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { fetchPosts, fetchThread } from "data/thread/actions";

import {
  selectThreadsFromForum,
  getForumIdFromThreadId,
  selectPostsFromThread,
  selectThread
} from "data/thread/selectors";

import { ActivityIndicator } from "react-native-paper";

import styled from "styled-components/native";
import PostListItem from "components/PostListItem";
import Pagination from "components/Pagination";
import { H1 } from "components/Title";
import Loader from "components/Loader";

const ThreadBackground = styled.View`
  background-color: ${props => props.theme.background};
  flex: 1;
  display: flex;
`;

const Title = styled(H1)`
  margin: 16px;
`;

class Thread extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title") || ""
  });

  constructor(props) {
    super(props);

    this.state = {
      initialFetch: false,
      fetching: true
    };
  }

  async componentDidMount() {
    const { fetchPosts, thread, page } = this.props;
    await fetchPosts(thread.id, page);
    this.setState({ initialFetch: true, fetching: false });
  }

  componentDidUpdate(prevProps) {
    const { posts, page, thread } = this.props;
    if (prevProps.thread.id !== thread.id || prevProps.page !== page) {
      if (
        !thread ||
        (thread && thread.meta.pages && page == thread.meta.pages) ||
        posts.length == 0
      ) {
        this.setState({ fetching: true }, async () => {
          const { fetchPosts } = this.props;
          await fetchPosts(thread.id, page);
          this.setState({ initialFetch: true, fetching: false });
        });
      }
    }
  }

  _keyExtractor(post) {
    return post.id;
  }

  loadPage(page) {
    if (page == -1) {
      return;
    }
    const { navigation, thread } = this.props;
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
              sections={[
                { title: thread.meta.name, data: posts },
                {
                  title: "__nav",
                  onlyNav: true,
                  data: [{ __empty: true }]
                }
              ]}
              keyExtractor={this._keyExtractor}
              renderItem={({ item }) =>
                item.__empty ? null : <PostListItem item={item} />
              }
              stickySectionHeadersEnabled={false}
              renderSectionHeader={({ section: { title, onlyNav } }) =>
                fetching && onlyNav ? null : (
                  <View>
                    {!onlyNav ? <Title>{title}</Title> : null}
                    <Pagination
                      loadPage={this.loadPage.bind(this)}
                      currPage={page}
                      pages={thread.meta.pages}
                    />
                    {fetching ? (
                      <ActivityIndicator size="large" animating={true} />
                    ) : null}
                  </View>
                )
              }
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
  const forumId = getForumIdFromThreadId(threadId)(state);
  const thread = selectThread(forumId, threadId)(state);

  const page = ownProps.navigation.getParam("page", thread.meta.pages);
  return {
    thread: thread,
    posts: selectPostsFromThread(threadId, page)(state),
    page: page
  };
};

const mapDispatchToProps = dispatch => ({
  fetchPosts: bindActionCreators(fetchPosts, dispatch),
  fetchThread: bindActionCreators(fetchThread, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);
