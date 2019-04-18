import React from "react";
import { View, Image, SectionList } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styled from "styled-components/native";

import { getSettings } from "data/user/selectors";
import { fetchThreadLinks } from "data/thread/actions";
import { selectThreadsFromForum } from "data/thread/selectors";

import ThreadListItem from "components/ThreadListItem";
import Pagination from "components/Pagination";
import { H1 } from "components/Title";
import Loader from "components/Loader";

import { LogoWhite } from "assets";

const ForumBackground = styled.View`
  display: flex;
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const Title = styled(H1)`
  margin: 16px;
  color: ${props => props.theme.text};
`;

const Bottom = styled(Pagination)`
  margin-bottom: 24px;
`;

class Forum extends React.Component {
  static navigationOptions = () => ({
    headerTitle: (
      <Image resizeMode="contain" style={{ width: 110 }} source={LogoWhite} />
    )
  });

  constructor(props) {
    super(props);

    this.state = {
      initialFetch: false,
      fetching: true
    };
  }

  async componentDidMount() {
    const { fetchThreadLinks, forum, page } = this.props;
    await fetchThreadLinks(forum.id, page);
    this.setState({ initialFetch: true, fetching: false });
  }

  componentDidUpdate(prevProps) {
    const { page, forum } = this.props;
    if (prevProps.forum.id !== forum.id || prevProps.page !== page) {
      this.setState({ fetching: true }, async () => {
        const { fetchThreadLinks } = this.props;
        await fetchThreadLinks(forum.id, page);
        this.setState({ initialFetch: true, fetching: false });
      });
    }
  }

  _keyExtractor(thread) {
    return `${thread.id}`;
  }

  loadPage(page) {
    if (page == -1) {
      return;
    }
    const { navigation, forum } = this.props;
    this.setState({ fetching: true });
    navigation.navigate("Forum", { forumId: forum.id, page });
  }

  render() {
    const {
      fetchThreadLinks,
      threads,
      forum,
      page,
      markAsRead,
      idCache
    } = this.props;
    const { initialFetch, fetching } = this.state;

    return (
      <ForumBackground>
        {initialFetch ? (
          <SectionList
            onRefresh={() => {
              this.setState({ fetching: true }, async () => {
                await fetchThreadLinks(forum.id, page);
                this.setState({ fetching: false });
              });
            }}
            refreshing={fetching}
            sections={[{ title: forum.meta.name, data: threads }]}
            keyExtractor={this._keyExtractor}
            renderItem={({ item, index }) => (
              <ThreadListItem
                markAsRead={markAsRead}
                forumName={forum.meta.name}
                item={item}
                cached={idCache.indexOf(item.id) !== -1}
                divider={index !== threads.length - 1}
              />
            )}
            stickySectionHeadersEnabled={false}
            ListFooterComponent={
              <Bottom
                loadPage={this.loadPage.bind(this)}
                page={page}
                pages={forum.meta.pages}
              />
            }
            renderSectionHeader={({ section: { title } }) => (
              <View>
                <Title>{title}</Title>
                <Pagination
                  loadPage={this.loadPage.bind(this)}
                  page={page}
                  pages={forum.meta.pages}
                />
              </View>
            )}
          />
        ) : (
          <Loader size="large" />
        )}
      </ForumBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const forumId = ownProps.navigation.getParam("forumId");
  const page = ownProps.navigation.getParam("page", 1);
  const idCache = getSettings(state).threadCache.map(e => e.id);
  return {
    threads: selectThreadsFromForum(forumId, page)(state),
    forum: state.forum.forums[forumId],
    page: page,
    markAsRead: getSettings(state).markAsRead,
    idCache: idCache
  };
};

const mapDispatchToProps = dispatch => ({
  fetchThreadLinks: bindActionCreators(fetchThreadLinks, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Forum);
