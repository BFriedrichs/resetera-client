import React from "react";
import { withTheme } from "styled-components/native";
import { Video as ExpoVideo } from "expo";
import { View, Text, WebView, TouchableOpacity } from "react-native";
import { WebBrowser } from "expo";
import Loader from "components/Loader";

class IFrame extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tweet: { html: "Loading tweet..." },
      size: { width: 1, height: 1 },
      loaded: false
    };
  }

  componentDidMount() {
    const { src, display } = this.props;

    if (!this.state.loaded && display === "tweet") {
      fetch(`https://publish.twitter.com/oembed?url=${src}`)
        .then(json => json.json())
        .then(result => {
          this.setState({ tweet: result });
        });
    }
  }

  // https://github.com/facebook/react-native/issues/10865#issuecomment-269847703
  postMessage() {
    const patchPostMessageFunction = function() {
      var originalPostMessage = window.postMessage;

      var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };

      patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace(
          "hasOwnProperty",
          "postMessage"
        );
      };

      window.postMessage = patchedPostMessage;
    };
    patchPostMessageFunction();

    const x = setInterval(() => {
      const wrapper = document.getElementById("wrapper");
      if (wrapper.children.length > 0) {
        const data = {
          size: wrapper.getBoundingClientRect()
        };
        wrapper.style.visibility = "visible";
        window.postMessage(JSON.stringify(data));
        clearInterval(x);
      }
    }, 500);
  }

  render() {
    const { src, display, theme } = this.props;

    switch (display) {
      case "native":
        return <Text>Err with vid</Text>;
      case "iframe":
        return (
          <WebView
            style={{
              flex: 1,
              width: "100%",
              paddingBottom: "55.9%"
            }}
            javaScriptEnabled={true}
            useWebKit={true}
            allowsInlineMediaPlayback
            source={{ uri: src }}
          />
        );
      case "tweet":
        const html = `<script type="text/javascript" src="https://platform.twitter.com/widgets.js"></script><style>body {color: white; background-color: ${theme.background.lighten(
          0.5
        )};}</style><div id="wrapper" style="visibility: hidden;">${
          this.state.tweet.html
        }</div>`;
        return (
          <TouchableOpacity
            onPress={() => {
              WebBrowser.openBrowserAsync(src);
            }}
            style={{
              width: "100%",
              overflow: "hidden",
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            <WebView
              style={{
                opacity: this.state.loaded ? 1 : 0,
                width: "186%",
                paddingBottom:
                  (this.state.size.height / this.state.size.width) * 200 + "%"
              }}
              javaScriptEnabled={true}
              injectedJavaScript={`(${this.postMessage.toString()})()`}
              useWebKit={true}
              scrollEnabled={false}
              source={{ html }}
              onMessage={evt => {
                const data = JSON.parse(evt.nativeEvent.data);
                this.setState({ loaded: true, size: data.size });
              }}
            />
            {this.state.loaded ? null : (
              <View
                style={{ position: "absolute", alignSelf: "center", top: 50 }}
              >
                <Text style={{ color: theme.text }}>Tweet is loading</Text>
                <Loader color={theme.text.toString()} />
              </View>
            )}
          </TouchableOpacity>
        );
      default:
        return <Text>Err with vid</Text>;
    }
  }
}

export default withTheme(IFrame);