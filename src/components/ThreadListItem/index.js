import React from "react";
import { Text } from "react-native";
import { withNavigation } from "react-navigation";
import styled, { withTheme } from "styled-components/native";

import TouchableDebounce from "components/TouchableDebounce";
import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";

import { H3, H4 } from "components/Title";

const ListItemWrapper = styled.View`
  padding: 16px 8px 16px 32px;
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
  top: 17px;
  left: 10px;
  align-content: center;
`;

const IconPos = styled.View`
  top: -2px;
  margin-right: 4px;
`;

const Title = styled(H3)`
  ${props => (props.isCached ? `color: ${props.theme.text.alpha(0.5)};` : "")};
`;

const ThreadListItem = ({
  navigation,
  forumName,
  item,
  theme,
  divider,
  markAsRead,
  cached
}) => (
  <TouchableDebounce
    activeOpacity={0.6}
    onPress={() =>
      navigation.push("Thread", { threadId: item.id, title: forumName })
    }
    delayPressIn={20}
  >
    <ListItemWrapper divider={divider}>
      <SpacedCont>
        <Info>{item.latest_date}</Info>
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
          const iconStyle = {
            color: theme.text,
            marginBottom: 4
          };
          switch (e) {
            case "sticky":
              return <Entypo key={i} name="pin" size={12} style={iconStyle} />;
            case "locked":
              return (
                <Ionicons key={i} name="md-lock" size={16} style={iconStyle} />
              );
            case "poll":
              return (
                <MaterialIcons
                  key={i}
                  name="poll"
                  size={16}
                  style={iconStyle}
                />
              );
            default:
              return <Text key={i}>{e}</Text>;
          }
        })}
      </Status>
      <Title isCached={markAsRead && cached}>{item.meta.name}</Title>
    </ListItemWrapper>
  </TouchableDebounce>
);

export default withTheme(withNavigation(ThreadListItem));
