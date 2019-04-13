import React from "react";
import { View, Image, SectionList } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styled from "styled-components/native";

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

const BottomPadding = styled.View`
  width: 100%;
  height: 24px;
`;

class Forum extends React.Component {
  static navigationOptions = ({ navigation }) => ({
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
    const { threads, page, forum } = this.props;
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
    navigation.navigate("Forum", { forumId: forum.id, page });
  }

  render() {
    const { threads, forum, page } = this.props;
    const { initialFetch, fetching } = this.state;

    return (
      <ForumBackground>
        {initialFetch ? (
          <SectionList
            sections={[
              { title: forum.meta.name, data: threads },
              {
                title: "__nav",
                onlyNav: true,
                data: [{ __empty: true }]
              }
            ]}
            keyExtractor={this._keyExtractor}
            renderItem={({ item, index }) =>
              item.__empty ? (
                <BottomPadding />
              ) : (
                <ThreadListItem
                  forumName={forum.meta.name}
                  item={item}
                  divider={index !== threads.length - 1}
                />
              )
            }
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section: { title, onlyNav } }) =>
              fetching && onlyNav ? null : (
                <View>
                  {!onlyNav ? <Title>{title}</Title> : null}
                  <Pagination
                    loadPage={this.loadPage.bind(this)}
                    page={page}
                    pages={forum.meta.pages}
                  />
                  {fetching ? <Loader size="large" /> : null}
                </View>
              )
            }
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
  return {
    threads: selectThreadsFromForum(forumId, page)(state),
    forum: state.forum.forums[forumId],
    page: page
  };
};

const mapDispatchToProps = dispatch => ({
  fetchThreadLinks: bindActionCreators(fetchThreadLinks, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Forum);
