import React from "react";
import { View, Image } from "react-native";
import {
  DefaultText,
  Bold,
  Block,
  BlockTitle,
  Link,
  RemoteImage
} from "components/ParserComponents";

const parseText = text => {
  return text.map((e, i) => {
    switch (e.type) {
      case "text":
        return <DefaultText key={i}>{e.content}</DefaultText>;
        break;
      case "textgroup":
        return <DefaultText key={i}>{parseText(e.content)}</DefaultText>;
        break;
      case "image":
        return <RemoteImage key={i} src={e.attrs.src} />;
        break;
      case "bold":
        return <Bold key={i}>{parseText(e.content)}</Bold>;
        break;
      case "linkto":
        const { type, ...additionalAttrs } = e.attrs;
        return (
          <Link
            internal={e.attrs.type === "internal"}
            key={i}
            {...additionalAttrs}
          >
            {parseText(e.content)}
          </Link>
        );
        break;
      case "textlist":
        return <View key={i}>{parseText(e.content)}</View>;
        break;
      case "textlistitem":
        return <View key={i}>{parseText(e.content)}</View>;
        break;
      case "block":
        return <Block key={i}>{parseText(e.content)}</Block>;
        break;
      case "blocktitle":
        return <BlockTitle key={i}>{parseText(e.content)}</BlockTitle>;
        break;
      default:
        return parseText(e.content);
    }
  });
};

export default parseText;
