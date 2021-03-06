import React from "react";
import { Font, Asset, Updates } from "expo";
import { Dimensions, StatusBar, View, Animated } from "react-native";

import {
  Ionicons,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import styled from "styled-components/native";

import { LogoWhite, LogoDark, Forum } from "assets";
import SafeComponent from "components/SafeComponent";

StatusBar.setBarStyle("light-content");

const Centered = styled.View`
  align-content: center;
  justify-content: center;
  background-color: #8848c6;
  width: 100%;
  height: 100%;
`;

class SetupAndLoad extends SafeComponent {
  constructor(props) {
    super(props);

    this.state = {
      pos: new Animated.Value(-23),
      scale: new Animated.Value(1)
    };

    this.fonts = [
      Ionicons.font,
      Entypo.font,
      MaterialIcons.font,
      MaterialCommunityIcons.font
    ];
  }

  _loadFonts() {
    return this.fonts.map(font => Font.loadAsync(font));
  }

  _loadImages() {
    const images = [LogoWhite, LogoDark, ...Object.values(Forum)];

    return images.map(image => Asset.fromModule(image).downloadAsync());
  }

  async componentDidMount() {
    Updates.checkForUpdateAsync()
      .then(update => {
        if (update.isAvailable) {
          Updates.reload();
        }
      })
      .catch(err => {
        if (!__DEV__) {
          console.error(err);
        }
      });

    const { cb } = this.props;
    const { height } = Dimensions.get("window");

    const loadFonts = this._loadFonts();
    const loadImages = this._loadImages();
    await Promise.all(...loadImages, ...loadFonts);

    const bounce = Animated.sequence([
      Animated.timing(this.state.scale, {
        toValue: 2,
        duration: 300
      }),
      Animated.timing(this.state.scale, {
        toValue: 1.1,
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
              width: 100,
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
