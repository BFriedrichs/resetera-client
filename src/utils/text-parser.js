import React from "react";
import { View, Text } from "react-native";
import * as Parser from "components/ParserComponents";

const parseText = text => {
  return text.map((e, i) => {
    switch (e.type) {
      case "text":
        return <Text key={i}>{e.content}</Text>;
      case "textgroup":
        return (
          <Parser.DefaultText key={i}>
            {parseText(e.content)}
          </Parser.DefaultText>
        );
      case "image":
        return <Parser.RemoteImage key={i} src={e.attrs.src} />;
      case "iframe":
        return <Parser.IFrame key={i} {...e.attrs} />;
      case "bold":
        return <Parser.Bold key={i}>{parseText(e.content)}</Parser.Bold>;
      case "spoiler":
        return <Parser.Spoiler key={i}>{parseText(e.content)}</Parser.Spoiler>;
      case "linkto": {
        const { type, ...additionalAttrs } = e.attrs;
        return (
          <Parser.Link
            internal={type === "internal"}
            key={i}
            {...additionalAttrs}
          >
            {parseText(e.content)}
          </Parser.Link>
        );
      }
      case "textlist":
        return (
          <Parser.TextList key={i} {...e.attrs}>
            {parseText(e.content)}
          </Parser.TextList>
        );
      case "textlistitem":
        return <View key={i}>{parseText(e.content)}</View>;
      case "block":
        return <Parser.Block key={i}>{parseText(e.content)}</Parser.Block>;
      case "blocktitle":
        return (
          <Parser.BlockTitle key={i}>{parseText(e.content)}</Parser.BlockTitle>
        );
      default:
        return parseText(e.content);
    }
  });
};

export default parseText;
