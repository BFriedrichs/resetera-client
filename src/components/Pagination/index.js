import React from "react";
import { Picker } from "react-native";
import styled from "styled-components/native";
import { Button, Card, TextInput } from "react-native-paper";

import BlurOverlay from "components/BlurOverlay";

const PaginationContainer = styled(Card)`
  margin: 0 8px 0 8px;
  border-radius: 16px;
  padding: 0 0 16px 0;
  background-color: ${props => props.theme.background.lighten(0.5)};
`;

const ContentContainer = styled(Card.Content)`
  flex-direction: row;
  justify-content: space-around;
`;

const ButtonWidth = styled(Button).attrs(props => ({
  color: props.theme.text.toString()
}))`
  min-width: 45px;
`;

const Input = styled(TextInput)`
  position: absolute;
  left: 8px;
  width: 100%;
  bottom: 50px;
`;

class Pagination extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pickerVisible: false,
      pickerValue: props.page,
      text: ""
    };
  }

  render() {
    const { loadPage, page, pages, style } = this.props;
    if (pages == 1) return null;
    const nav = [
      {
        page: parseInt(page) - 1,
        disabled: page == 1,
        label: "<"
      },
      { label: `${page}`, page: page },
      {
        page: parseInt(page) + 1,
        disabled: page == pages,
        label: ">"
      },
      { page: pages, disabled: page == pages, label: ">>" },
      { label: "...", page: -1 }
    ];

    const { pickerVisible, pickerValue } = this.state;
    return (
      <PaginationContainer style={style}>
        <ContentContainer>
          {nav.map((r, i) => (
            <ButtonWidth
              compact
              key={i}
              mode={i == 1 ? "contained" : "outlined"}
              onPress={() => {
                if (r.page == -1) {
                  this.setState({ pickerVisible: true });
                } else {
                  loadPage(r.page);
                }
              }}
              disabled={r.disabled}
            >
              {r.label}
            </ButtonWidth>
          ))}
        </ContentContainer>
        {pickerVisible ? (
          <BlurOverlay contentInCard>
            <Picker
              style={{
                height: 250,
                width: 250
              }}
              selectedValue={`${pickerValue}`}
              onValueChange={(itemValue, _itemIndex) => {
                this.setState({ pickerValue: itemValue });
              }}
            >
              {[...new Array(pages)].map((_, p) => {
                return (
                  <Picker.Item
                    key={p}
                    label={`${p + 1}`}
                    value={`${parseInt(p) + 1}`}
                  />
                );
              })}
            </Picker>
            <Input
              numberOfLines={1}
              keyboardType="numeric"
              label="Page"
              value={`${pickerValue}`}
              onChangeText={text =>
                this.setState({
                  pickerValue: Math.max(1, Math.min(text, pages))
                })
              }
            />
            <Card.Actions style={{ alignSelf: "flex-end" }}>
              <Button
                onPress={() => {
                  this.setState({ pickerVisible: false });
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  this.setState({ pickerVisible: false });
                  loadPage(pickerValue);
                }}
              >
                Done
              </Button>
            </Card.Actions>
          </BlurOverlay>
        ) : null}
      </PaginationContainer>
    );
  }
}

export default Pagination;
