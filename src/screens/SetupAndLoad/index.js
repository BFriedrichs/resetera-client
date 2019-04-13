import React from "react";
import { Font, Asset } from "expo";
import {
  Dimensions,
  StatusBar,
  View,
  Text,
  Image,
  Animated
} from "react-native";

import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { LogoWhite, LogoDark, Forum } from "assets";

StatusBar.setBarStyle("light-content");

const Centered = styled.View`
  align-content: center;
  justify-content: center;
  background-color: #8848c6;
  width: 100%;
  height: 100%;
`;

class SetupAndLoad extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pos: new Animated.Value(0),
      scale: new Animated.Value(1)
    };

    this.fonts = [Ionicons.font, Entypo.font, MaterialIcons.font];
  }

  _loadFonts() {
    return this.fonts.map(font => Font.loadAsync(font));
  }

  _loadImages() {
    const images = [LogoWhite, LogoDark, ...Object.values(Forum)];

    return images.map(image => Asset.fromModule(image).downloadAsync());
  }

  async componentDidMount() {
    const { cb } = this.props;
    const { height, width } = Dimensions.get("window");

    const loadFonts = this._loadFonts();
    const loadImages = this._loadImages();
    await Promise.all(...loadImages, ...loadFonts);

    const bounce = Animated.sequence([
      Animated.timing(this.state.scale, {
        toValue: 1.1,
        duration: 300
      }),
      Animated.timing(this.state.scale, {
        toValue: 0.55,
        duration: 300
      })
    ]);
    const scroll = Animated.timing(this.state.pos, {
      toValue: -height / 2 + 36,
      duration: 800
    });

    Animated.sequence([bounce, scroll]).start(() => {
      cb();
    });
  }

  render() {
    return (
      <Centered>
        <View>
          <Animated.Image
            resizeMode="contain"
            style={{
              position: "absolute",
              top: this.state.pos,
              width: 200,
              alignSelf: "center",
              transform: [
                { scaleX: this.state.scale },
                { scaleY: this.state.scale }
              ]
            }}
            source={LogoWhite}
          />
        </View>
      </Centered>
    );
  }
}

export default SetupAndLoad;
