import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  View,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  Dimensions,
  Animated,
  Platform
} from "react-native";
import styled from "styled-components/native";
import { WebBrowser, FileSystem, MediaLibrary } from "expo";
import { ActivityIndicator } from "react-native-paper";

import { connectActionSheet } from "@expo/react-native-action-sheet";

import { addToImageCache } from "data/thread/actions";

import getBase64FromImageSource from "utils/image-to-base64";

import SafeComponent from "components/SafeComponent";

const PostImage = styled(Animated.Image)`
  width: ${props => props.w || 0}px;
  height: ${props => props.h || 0}px;
  max-width: 100%;
`;

const LoadingOverlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  align-content: center;
  justify-content: center;
`;

const LoadingIndicator = () => (
  <LoadingOverlay>
    <ActivityIndicator animating={true} color="#ffffff" />
  </LoadingOverlay>
);

@connectActionSheet
class RemoteImage extends SafeComponent {
  constructor(props) {
    super(props);

    const cached = props.cachedImage;
    const size = cached && cached.size;
    this.state = {
      width: (size && size.width) || 500,
      height: (size && size.height) || 250,
      sizeLoaded: props.isCached,
      imageLoaded: props.isCached,
      isLoadingShare: false,
      radius: new Animated.Value(5)
    };

    this._isMounted = false;
  }

  componentDidMount() {
    const { isCached, src, addToImageCache } = this.props;
    this._isMounted = true;

    if (!isCached) {
      Image.getSize(src, (w, h) => {
        if (this._isMounted) {
          const dims = Dimensions.get("window");
          const ar = h / w;

          const dimWidth = dims.width - 24;
          const isFullWidth = w > dimWidth;

          const newWidth = isFullWidth ? dimWidth : w;
          const newHeight = isFullWidth ? newWidth * ar : h;

          addToImageCache(src, { width: newWidth, height: newHeight });
          this.setState(
            {
              width: newWidth,
              height: newHeight,
              sizeLoaded: true
            },
            () => {
              Animated.timing(this.state.radius, {
                toValue: 0,
                duration: 1000
              }).start();
            }
          );
        }
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async openShareWithData(data) {
    const dataUrl = `data:image/png;base64,${data}`;
    if (Platform.OS === "ios") {
      setTimeout(() => {
        ActionSheetIOS.showShareActionSheetWithOptions(
          {
            url: dataUrl
          },
          err => {
            console.error(err);
            if (this._isMounted) {
              this.setState({ isLoadingShare: false });
            }
          },
          () => {
            if (this._isMounted) {
              this.setState({ isLoadingShare: false });
            }
          }
        );
      }, 1500);
    } else {
      const ext = this.props.src.split(".").pop();
      const localUri = await FileSystem.downloadAsync(
        dataUrl,
        FileSystem.documentDirectory + "temp." + ext
      );
      await MediaLibrary.createAssetAsync(localUri);
    }
  }

  handleAction(buttonIndex) {
    const { src } = this.props;
    switch (buttonIndex) {
      case 1:
        WebBrowser.openBrowserAsync(src);
        break;
      case 2:
        this.setState({ isLoadingShare: true }, () => {
          getBase64FromImageSource(src)
            .then(data => {
              this.openShareWithData.bind(this)(data);
            })
            .catch(err => {
              console.error(err);
              if (this._isMounted) {
                this.setState({ isLoadingShare: false });
              }
            });
        });
        break;
    }
  }

  render() {
    const { src, showActionSheetWithOptions } = this.props;
    const { width, height, isLoadingShare, radius } = this.state;

    const actions = {
      options: ["Cancel", "Open Image in Safari", "Save Image"],
      cancelButtonIndex: 0,
      title: "Image Options"
    };

    return (
      <View>
        <TouchableOpacity
          delayPressIn={20}
          onLongPress={() => {
            showActionSheetWithOptions(actions, this.handleAction.bind(this));
          }}
        >
          <PostImage
            resizeMode={"contain"}
            source={{ uri: src }}
            w={width}
            h={height}
            blurRadius={radius}
            onLoadEnd={() => {
              if (this._isMounted) {
                this.setState({
                  imageLoaded: true
                });
              }
            }}
          />
        </TouchableOpacity>
        {isLoadingShare ? <LoadingIndicator /> : null}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { src } = ownProps;
  const cache = state.thread.imageCache[src];
  return {
    isCached: !!cache,
    cachedImage: cache
  };
};

const mapDispatchToProps = dispatch => ({
  addToImageCache: bindActionCreators(addToImageCache, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteImage);
