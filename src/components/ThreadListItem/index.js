import React from "react";
import { View, Text } from "react-native";
import { withNavigation } from "react-navigation";
import styled, { withTheme } from "styled-components/native";

import { List, TouchableRipple } from "react-native-paper";
import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";

import { H3, H4 } from "components/Title";

const ListItemWrapper = styled.View`
  padding: 24px 32px;
  justify-content: center;
  border-color: ${props => props.theme.background.darken(0.2)};
  border-bottom-width: ${props => (props.divider ? 1 : 0)};
`;

const Info = styled(H4)`
  color: ${props => props.theme.text.darken(0.3)};
`;

const Cont = styled.View`
  display: flex;
  flex-flow: row;
`;

const SpacedCont = styled(Cont)`
  justify-content: space-between;
`;

const ContCount = styled.View`
  display: flex;
  flex-flow: row;
  margin-left: 8px;
`;

const Status = styled(Cont)`
  flex-flow: column;
  position: absolute;
  top: 24px;
  left: 12px;
`;

const IconPos = styled.View`
  top: -2px;
  margin-right: 4px;
`;

const ThreadListItem = ({ navigation, forumName, item, theme, divider }) => (
  <TouchableRipple
    rippleColor="rgba(0, 0, 0, .8)"
    onPress={() =>
      navigation.push("Thread", { threadId: item.id, title: forumName })
    }
  >
    <ListItemWrapper divider={divider}>
      <SpacedCont>
        <Info>{item.date}</Info>
        <ContCount>
          <ContCount>
            <IconPos>
              <Ionicons
                name="ios-glasses"
                size={20}
                color={theme.text.darken(0.3).toString()}
              />
            </IconPos>
            <Info>{item.view_count}</Info>
          </ContCount>
          <ContCount>
            <IconPos>
              <Entypo
                name="message"
                size={20}
                color={theme.text.darken(0.3).toString()}
              />
            </IconPos>
            <Info>{item.post_count}</Info>
          </ContCount>
        </ContCount>
      </SpacedCont>
      <Status>
        {item.statuses.map((e, i) => {
          switch (e) {
            case "sticky":
              return (
                <Entypo
                  key={i}
                  name="pin"
                  size={12}
                  style={{ color: theme.text }}
                />
              );
            case "locked":
              return (
                <Ionicons
                  key={i}
                  name="md-lock"
                  size={16}
                  style={{ color: theme.text }}
                />
              );
            case "poll":
              return (
                <MaterialIcons
                  key={i}
                  name="poll"
                  size={16}
                  style={{ color: theme.text }}
                />
              );
            default:
              return <Text key={i}>{e}</Text>;
          }
        })}
      </Status>
      <H3>{item.meta.name}</H3>
    </ListItemWrapper>
  </TouchableRipple>
);

export default withTheme(withNavigation(ThreadListItem));
