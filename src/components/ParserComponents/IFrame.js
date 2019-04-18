import React from "react";
import { withTheme } from "styled-components/native";
import { View, Text, WebView } from "react-native";
import { WebBrowser } from "expo";

import fetchWithTimeout from "utils/fetchWithTimeout";

import Loader from "components/Loader";
import TouchableDebounce from "components/TouchableDebounce";

class IFrame extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tweet: { html: "Loading tweet..." },
      size: { width: 1, height: 1 },
      loaded: false,
      error: false
    };

    this._mounted = false;
  }

  componentDidMount() {
    const { src, display } = this.props;
    this._mounted = true;

    if (!this.state.loaded && display === "tweet") {
      fetchWithTimeout(`https://publish.twitter.com/oembed?url=${src}`)
        .then(json => json.json())
        .catch(_ => {})
        .then(result => {
          if (this._mounted) {
            if (result.errors) {
              this.setState({
                error: true,
                tweet: {
                  html:
                    "Error loading tweet. You can try tapping here to load it in your browser."
                }
              });
            } else {
              this.setState({ tweet: result });
            }
          }
        });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  /* eslint-disable no-undef */
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
  /* eslint-enable no-undef */

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
      case "tweet": {
        const html = `<script type="text/javascript" src="https://platform.twitter.com/widgets.js"></script><style>body {color: ${
          theme.text
        };}</style><div id="wrapper" style="visibility: hidden;">${
          this.state.tweet.html
        }</div>`;
        return (
          <TouchableDebounce
            onPress={() => {
              WebBrowser.openBrowserAsync(src);
            }}
            style={{
              width: "100%",
              overflow: "hidden",
              height: this.state.loaded ? "auto" : 150,
              alignContent: "center",
              justifyContent: "center"
            }}
            delayPressIn={20}
          >
            {this.state.loaded || !this.state.error ? null : (
              <View
                style={{ position: "absolute", alignSelf: "center", top: 50 }}
              >
                <Text style={{ color: theme.text }}>
                  {this.state.tweet.html}
                </Text>
                {this.state.error ? null : (
                  <Loader color={theme.text.toString()} />
                )}
              </View>
            )}
            <WebView
              style={{
                backgroundColor: "transparent",
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
          </TouchableDebounce>
        );
      }
      default:
        return <Text>Err with vid</Text>;
    }
  }
}

export default withTheme(IFrame);
