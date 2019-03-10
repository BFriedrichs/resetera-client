import React from "react";
import { View, Text } from "react-native";
import { withNavigation } from "react-navigation";

import asListItem from "utils/list-item-wrapper";

import ListItem from "components/ListItem";

const ThreadListItem = ({ navigation, item, forumName }) => (
  <ListItem
    divider
    title={item.name}
    onPress={() =>
      navigation.push("Thread", { threadId: item.id, title: forumName })
    }
  />
);

export default asListItem(withNavigation(ThreadListItem));
