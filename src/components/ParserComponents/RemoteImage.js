import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  CameraRoll,
  ActionSheetIOS,
  Dimensions
} from "react-native";
import styled from "styled-components/native";
import { WebBrowser } from "expo";
import { ActivityIndicator } from "react-native-paper";

import { setThreadScrollable, addToImageCache } from "data/other/actions";
import PeekView from "components/PeekView";
import BlurOverlay from "components/BlurOverlay";

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

  componentDidUpdate(prevProps, prevState) {}

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
          console.log(err);
          this.setState({ isLoadingShare: false });
        },
        () => {
          this.setState({ isLoadingShare: false });
        }
      );
    }, 1500);
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
              console.log(err);
              this.setState({ isLoadingShare: false });
            });
        });
        break;
    }
  }

  render() {
    const { src, addToImageCache } = this.props;
    const {
      width,
      height,
      sizeLoaded,
      imageLoaded,
      isLoadingShare
    } = this.state;

    const actions = {
      options: ["Cancel", "Open Image in Safari", "Save Image"],
      cancelButtonIndex: 0
    };

    return (
      <View>
        <TouchableHighlight
          onLongPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              actions,
              this.handleAction.bind(this)
            );
          }}
        >
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
        </TouchableHighlight>
        {!imageLoaded || isLoadingShare ? <LoadingIndicator /> : null}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { src } = ownProps;
  const cache = state.other.imageCache[src];
  return {
    isCached: !!cache,
    cachedImage: cache
  };
};

const mapDispatchToProps = dispatch => ({
  setThreadScrollable: bindActionCreators(setThreadScrollable, dispatch),
  addToImageCache: bindActionCreators(addToImageCache, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteImage);
