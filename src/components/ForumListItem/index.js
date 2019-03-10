import React from "react";
import { View, Text } from "react-native";
import { withNavigation } from "react-navigation";

import asListItem from "utils/list-item-wrapper";

import ListItem from "components/ListItem";

const ForumListItem = ({ navigation, item }) => (
  <ListItem
    divider
    title={item.name}
    onPress={() => navigation.navigate("Forum", { forumId: item.id })}
  />
);

export default asListItem(withNavigation(ForumListItem));
