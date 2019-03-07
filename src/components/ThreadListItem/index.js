import React from "react";
import { View, Text } from "react-native";
import { ListItem } from "react-native-material-ui";
import { withNavigation } from "react-navigation";

import asListItem from "utils/list-item-wrapper";

const listStyle = {
  container: {
    height: 75
  }
};

const ThreadListItem = ({ navigation, item }) => (
  <ListItem
    divider
    centerElement={{
      primaryText: item.name
    }}
    onPress={() => navigation.navigate("Thread", { forumId: item.id })}
    style={listStyle}
  />
);

export default asListItem(withNavigation(ThreadListItem));
