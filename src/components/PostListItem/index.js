import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { Card, Avatar } from "react-native-paper";

import parseText from "utils/text-parser";

import { H2, H4 } from "components/Title";

const PostBackground = styled(Card).attrs({
  elevation: 3
})`
  margin-bottom: 24px;
  padding: 0 0 16px 0;
  background-color: ${props => props.theme.background.lighten(0.5)};
`;

const CardContent = styled(View)`
  padding: 0 12px 8px 12px;
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
              <H2 bold>{item.user.name}</H2>
              <H4>{item.date}</H4>
            </PostInfo>
          </User>

          {parseText(item.content)}
        </CardContent>
      </PostBackground>
    );
  }
}

export default PostListItem;
