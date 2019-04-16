import React from "react";
import { View, Text, Image } from "react-native";
import { withNavigation } from "react-navigation";
import styled from "styled-components/native";
import { LinearGradient } from "expo";

import asListItem from "utils/list-item-wrapper";

import TouchableDebounce from "components/TouchableDebounce";
import BetterCard from "components/BetterCard";
import { H2, H4 } from "components/Title";
import { Forum } from "assets";

const Card = styled(BetterCard).attrs({
  contentStyle: { marginLeft: -16, paddingRight: 0, paddingLeft: 0 }
})`
  margin: 16px 16px 8px 16px;
  padding: 0;
`;

const ImageWrapper = styled.View`
  flex: 1;
  padding: 32px 32px 32px 16px;
  border-radius: 16px;
  overflow: hidden;
`;

const BGImage = styled.Image`
  position: absolute;
  tint-color: #009290;
  width: 200px;
  height: 200px;
  top: 0;
  right: -25px;
  resize-mode: contain;
`;

const ForumListItem = ({ navigation, item }) => (
  <TouchableDebounce
    onPress={() =>
      navigation.navigate("Forum", { forumId: item.id, title: item.meta.name })
    }
    activeOpacity={0.6}
  >
    <Card elevation={3}>
      <LinearGradient
        style={{ borderRadius: 16 }}
        colors={["#098ea6", "#29aa9f"]}
        start={[0, 0]}
        end={[1, 1]}
      >
        <ImageWrapper>
          <BGImage source={Forum[item.id]} />
          <H2 color="#fff">{item.meta.name}</H2>
          <H4 color="#fff">{item.meta.desc}</H4>
        </ImageWrapper>
      </LinearGradient>
    </Card>
  </TouchableDebounce>
);

export default asListItem(withNavigation(ForumListItem));
