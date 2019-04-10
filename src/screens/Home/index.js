import React from "react";
import { View, Text, FlatList, Image } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActivityIndicator, withTheme } from "react-native-paper";

import styled from "styled-components/native";
import { fetchForumLinks } from "data/forum/actions";

import ForumListItem from "components/ForumListItem";
import Loader from "components/Loader";

import { LogoWhite } from "assets";

const HomeBackground = styled(View)`
  display: flex;
  flex: 1;
  background-color: ${props => props.theme.background || "#fff"};
`;

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image resizeMode="contain" style={{ width: 110 }} source={LogoWhite} />
    )
  });

  constructor(props) {
    super(props);

    this.state = {
      initialFetch: false
    };
  }

  async componentDidMount() {
    await this.props.fetchForumLinks();
    this.setState({ initialFetch: true });
  }

  _keyExtractor(forum) {
    return forum.id;
  }

  render() {
    const { forums } = this.props;
    const { initialFetch } = this.state;
    return (
      <HomeBackground>
        {initialFetch ? (
          <FlatList
            data={forums}
            keyExtractor={this._keyExtractor}
            renderItem={ForumListItem}
          />
        ) : (
          <Loader size="large" />
        )}
      </HomeBackground>
    );
  }
}

const mapStateToProps = state => ({
  forums: Object.values(state.forum.forums)
});
const mapDispatchToProps = dispatch => ({
  fetchForumLinks: bindActionCreators(fetchForumLinks, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
