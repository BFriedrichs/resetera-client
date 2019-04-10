import React from "react";
import { View, Text } from "react-native";
import { withNavigation } from "react-navigation";

import asListItem from "utils/list-item-wrapper";

import ListItem from "components/ListItem";

const ThreadListItem = ({ navigation, forumName, item, ...props }) => (
  <ListItem
    divider
    title={item.meta.name}
    onPress={() =>
      navigation.push("Thread", { threadId: item.id, title: forumName })
    }
    {...props}
  />
);

export default asListItem(withNavigation(ThreadListItem));
