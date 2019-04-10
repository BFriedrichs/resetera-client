import React from "react";
import { View, Text } from "react-native";
import { withNavigation } from "react-navigation";
import styled from "styled-components/native";
import { Card, Avatar } from "react-native-paper";

import parseText from "utils/text-parser";
import asListItem from "utils/list-item-wrapper";

const PostBackground = styled(Card).attrs({
  elevation: 5
})`
  border-radius: 16px;
  margin-bottom: 24px;
  padding: 0;
  margin-left: 8px;
  margin-right: 8px;
  background-color: ${props => props.theme.background.lighten(0.5)};
`;

const CardContent = styled(View)`
  padding: 0 12px 12px 16px;
`;

const User = styled.View`
  flex-direction: row;
`;

const UserImage = styled(Avatar.Image)`
  top: -12px;
`;

const PostInfo = styled.View`
  margin-top: 8px;
  margin-left: 8px;
`;

const UserName = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: ${props => props.theme.text};
`;

const PostDate = styled.Text`
  font-size: 13px;
  color: #868686;
  color: ${props => props.theme.text};
`;

class PostListItem extends React.PureComponent {
  render() {
    const { item } = this.props;
    return (
      <PostBackground>
        <CardContent>
          <User>
            <UserImage
              size={64}
              source={{ uri: `https://resetera.com${item.user.avatar}` }}
            />
            <PostInfo>
              <UserName>{item.user.name}</UserName>
              <PostDate>{item.date}</PostDate>
            </PostInfo>
          </User>

          {parseText(item.content)}
        </CardContent>
      </PostBackground>
    );
  }
}

export default PostListItem;
