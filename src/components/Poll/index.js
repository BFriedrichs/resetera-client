import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { Card } from "react-native-paper";

import { H2, H4 } from "components/Title";

const PostBackground = styled(Card).attrs({
  elevation: 5
})`
  border-radius: 16px;
  margin-bottom: 24px;
  padding: 0 0 16px 0;
  margin-left: 8px;
  margin-right: 8px;
  background-color: ${props => props.theme.background.lighten(0.5)};
`;

const CardContent = styled(View)`
  padding: 16px 12px 12px 16px;
`;

const ResultsContainer = styled.View`
  display: flex;
  flex-flow: column;
  margin: 16px 0;
  border-radius: 16px;
  overflow: hidden;
`;

const ResultRow = styled.View`
  flex-flow: row;
  padding: 20px 8px;
  justify-content: space-between;
  align-content: center;
  border-bottom-color: ${props => props.theme.background.adjust(0.2)};
  border-bottom-width: ${props => (props.divider ? "1px" : "0")};
  background-color: ${props => props.theme.background};
`;

const RowFill = styled.View`
  background-color: ${props => props.theme.background.adjust(0.2)};
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${props => props.width}%;
  flex: 1;
  padding: 20px 0;
`;

const RowText = styled(H4)``;

const FloatRight = styled(RowText)`
  text-align: right;
`;

const Name = styled(RowText)`
  align-self: center;
`;

const Poll = ({ poll }) => (
  <PostBackground>
    <CardContent>
      <H2>{poll.title}</H2>
      <ResultsContainer>
        {poll.results.map((e, i) => (
          <ResultRow divider={i < poll.results.length - 1} key={i}>
            <RowFill width={e.percentage} />
            <Name>{e.name}</Name>
            <View
              style={{
                alignContent: "flex-end",
                justifyContent: "flex-end"
              }}
            >
              <FloatRight>{e.votes}</FloatRight>
              <FloatRight>{e.percentage}%</FloatRight>
            </View>
          </ResultRow>
        ))}
      </ResultsContainer>
      <RowText>Total votes: {poll.total_votes}</RowText>
    </CardContent>
  </PostBackground>
);

export default Poll;
