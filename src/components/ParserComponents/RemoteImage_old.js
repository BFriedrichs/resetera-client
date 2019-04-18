/* eslint-disable */

import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  View,
  Image,
  TouchableWithoutFeedback,
  ActionSheetIOS,
  Dimensions
} from "react-native";
import styled from "styled-components/native";
import { WebBrowser } from "expo";
import { ActivityIndicator } from "react-native-paper";

import { addToImageCache } from "data/thread/actions";
import PeekView from "components/PeekView";
import getBase64FromImageSource from "utils/image-to-base64";

const PostImage = styled.Image`
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

const LoadingIndicator = ({ width, height }) => (
  <LoadingOverlay>
    <ActivityIndicator animating={true} color="#ffffff" />
  </LoadingOverlay>
);

class RemoteImage extends React.PureComponent {
  constructor(props) {
    super(props);

    const cached = props.cachedImage;
    const size = cached && cached.size;
    this.state = {
      width: (size && size.width) || 500,
      height: (size && size.height) || 250,
      sizeLoaded: props.isCached,
      imageLoaded: props.isCached,
      pressed: false,
      isLoadingShare: false
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
          const newWidth = dims.width - 44;
          const newHeight = newWidth * ar;
          this.setState({
            width: newWidth,
            height: newHeight,
            sizeLoaded: true
          });
          addToImageCache(src, { width: newWidth, height: newHeight });
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.pressed !== prevState.pressed) {
      // this.props.setThreadScrollable(!this.state.pressed);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  openShareWithData(data) {
    setTimeout(() => {
      ActionSheetIOS.showShareActionSheetWithOptions(
        {
          url: `data:image/png;base64,${data}`
        },
        err => {
          console.error(err);
          this.setState({ isLoadingShare: false });
        },
        () => {
          this.setState({ isLoadingShare: false });
        }
      );
    }, 1500);
  }

  render() {
    const { src } = this.props;
    const { width, height, imageLoaded, pressed, isLoadingShare } = this.state;

    const imageView = (
      <PostImage
        resizeMode={"contain"}
        source={{ uri: src }}
        w={width}
        h={height}
        onLoadEnd={() => {
          this.setState({
            imageLoaded: true
          });
        }}
      />
    );

    return (
      <View ref={this.image}>
        <PeekView
          visible={pressed || isLoadingShare}
          delay={2000}
          actions={{
            options: ["Cancel", "Open Image in Safari", "Save Image"],
            cancelButtonIndex: 0
          }}
          onAction={buttonIndex => {
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
                      this.setState({ isLoadingShare: false });
                    });
                });
                break;
            }
          }}
        >
          {isLoadingShare ? (
            <ActivityIndicator size="large" color="#4a4a4a" />
          ) : null}
          {imageView}
        </PeekView>
        <TouchableWithoutFeedback
          delayPressIn={300}
          onPressIn={() => {
            this.setState({ pressed: true });
          }}
          onPressOut={() => {
            this.setState({ pressed: false });
          }}
        >
          {imageView}
        </TouchableWithoutFeedback>
        {!imageLoaded ? <LoadingIndicator /> : null}
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

/* eslint-enable */
