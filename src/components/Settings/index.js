import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
  Animated,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from "react-native";
import styled from "styled-components/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  toggleSettingsDisplay,
  toggleTheme,
  markAsRead,
  setPushConfig
} from "data/user/actions";
import { userSelector, getSettings, getPushToken } from "data/user/selectors";

import TouchableDebounce from "components/TouchableDebounce";
import { H1, H4 } from "components/Title";

import SettingsRow from "./SettingsRow";

const Title = styled(H1)`
  margin-bottom: 16px;
`;

const SlidingView = styled(Animated.View)`
  height: 100%;
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
`;

const Fill = styled(TouchableDebounce)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Content = styled.View`
  height: 100%;
  width: 75%;
  background-color: ${props => props.theme.background};

  padding: 16px;
`;

const EditArea = styled.View`
  padding: 16px 0 0 0;
  flex-flow: row;
  align-content: center;
  align-items: center;
`;

const EditText = styled(H4)``;

const EditIcon = styled(MaterialCommunityIcons).attrs(props => ({
  name: "circle-edit-outline",
  size: 20,
  color: props.theme.text.toString()
}))`
  margin-left: 8px;
`;

class Settings extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      width: new Animated.Value(0),
      forumEditOpen: false
    };
  }

  setOpen(open) {
    if (open) {
      Animated.spring(this.state.width, {
        toValue: 1,
        duration: 300,
        overshootClamping: true
      }).start();
    } else {
      Animated.spring(this.state.width, {
        toValue: 0,
        duration: 300
      }).start();
      this.setState({ forumEditOpen: false });
    }
  }

  componentDidMount() {
    this.setOpen(this.props.open);
  }

  componentDidUpdate(prevProps) {
    const { open } = this.props;

    if (open !== prevProps.open) {
      this.setOpen(open);
    }
  }

  render() {
    const {
      toggleSettingsDisplay,
      toggleTheme,
      setPushConfig,
      settings,
      pushToken,
      markAsRead,
      forums
    } = this.props;
    const { width, forumEditOpen } = this.state;

    return (
      <SlidingView
        style={{
          left: width.interpolate({
            inputRange: [0, 1],
            outputRange: ["-100%", "0%"]
          })
        }}
      >
        <Fill onPress={toggleSettingsDisplay} />
        <Content>
          <ScrollView>
            <SafeAreaView>
              <Title>Settings</Title>
              <SettingsRow
                name="Trending Updates"
                description="Receive notifications about currently trending threads."
                isOn={settings.pushConfig.trending_active}
                onToggle={isOn => {
                  setPushConfig(pushToken, { trending_active: isOn });
                }}
              />
              <SettingsRow
                name="Thread Updates"
                description="Receive notifications about new threads."
                isOn={settings.pushConfig.new_active}
                onToggle={isOn => {
                  setPushConfig(pushToken, {
                    new_active: isOn
                  });
                }}
                enabledContent={
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ forumEditOpen: !forumEditOpen });
                    }}
                  >
                    <EditArea>
                      <EditText>Forums</EditText>
                      <EditIcon />
                    </EditArea>
                  </TouchableOpacity>
                }
              />
              {settings.pushConfig.new_active && forumEditOpen
                ? forums.map((e, i) => (
                    <SettingsRow
                      key={i}
                      padding={8}
                      name={e.meta.name}
                      isOn={settings.pushConfig.new_threads[`${e.id}`]}
                      onToggle={isOn => {
                        setPushConfig(pushToken, {
                          new_threads: {
                            ...settings.pushConfig.new_threads,
                            [`${e.id}`]: isOn
                          }
                        });
                      }}
                    />
                  ))
                : null}
              <SettingsRow
                name="Mark As Read"
                description="Visited threads will be grayed out."
                isOn={settings.markAsRead}
                onToggle={markAsRead}
              />
              <SettingsRow
                name="Dark Mode"
                description="Zzz."
                isOn={settings.darkMode}
                onToggle={toggleTheme}
              />
            </SafeAreaView>
          </ScrollView>
        </Content>
      </SlidingView>
    );
  }
}

const mapStateToProps = state => ({
  settings: getSettings(state),
  open: userSelector(state).open,
  pushToken: getPushToken(state),
  forums: Object.values(state.forum.forums)
});

const mapDispatchToProps = dispatch => ({
  toggleSettingsDisplay: bindActionCreators(toggleSettingsDisplay, dispatch),
  toggleTheme: bindActionCreators(toggleTheme, dispatch),
  setPushConfig: bindActionCreators(setPushConfig, dispatch),
  markAsRead: bindActionCreators(markAsRead, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
