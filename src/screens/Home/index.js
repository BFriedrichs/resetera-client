import React from "react";
import { View, Text, FlatList } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { fetchForumLinks } from "data/forum/actions";

import ForumListItem from "components/ForumListItem";

class Home extends React.Component {
  componentDidMount() {
    this.props.fetchForumLinks();
  }

  _keyExtractor(forum) {
    return forum.id;
  }

  render() {
    const { forums } = this.props;

    return (
      <View>
        <FlatList
          data={forums}
          keyExtractor={this._keyExtractor}
          renderItem={ForumListItem}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  forums: state.forum.forums
});
const mapDispatchToProps = dispatch => ({
  fetchForumLinks: bindActionCreators(fetchForumLinks, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
