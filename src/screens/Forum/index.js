import React from "react";
import { View, FlatList } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { fetchThreadLinks } from "data/thread/actions";
import { selectThreadsFromForum } from "data/thread/selectors";

import ThreadListItem from "components/ThreadListItem";

class Forum extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;
    const forumId = navigation.getParam("forumId");
    this.props.fetchThreadLinks(forumId);
  }

  _keyExtractor(thread) {
    return thread.id;
  }

  render() {
    const { threads } = this.props;
    return (
      <View>
        <FlatList
          data={threads}
          keyExtractor={this._keyExtractor}
          renderItem={ThreadListItem}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const forumId = ownProps.navigation.getParam("forumId");
  return {
    threads: selectThreadsFromForum(forumId)(state)
  };
};

const mapDispatchToProps = dispatch => ({
  fetchThreadLinks: bindActionCreators(fetchThreadLinks, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Forum);
