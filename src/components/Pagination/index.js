import React from "react";
import { View, Picker } from "react-native";
import styled from "styled-components/native";
import { Button, Card } from "react-native-paper";

import BlurOverlay from "components/BlurOverlay";

const PaginationContainer = styled(Card)`
  margin: 0 8px 24px 8px;
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

class Pagination extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pickerVisible: false,
      pickerValue: props.page
    };
  }

  render() {
    const { loadPage, currPage, pages } = this.props;
    if (pages == 1) return null;
    const nav = [
      {
        page: currPage - 1,
        disabled: currPage == 1,
        label: "<"
      },
      { label: `${currPage}`, page: currPage },
      {
        page: currPage + 1,
        disabled: currPage == pages,
        label: ">"
      },
      { page: pages, disabled: currPage == pages, label: ">>" },
      { label: "...", page: -1 }
    ];

    const { pickerVisible, pickerValue } = this.state;
    return (
      <PaginationContainer>
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
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ pickerValue: itemValue });
              }}
            >
              {[...new Array(pages)].map((_, p) => {
                return (
                  <Picker.Item key={p} label={`${p + 1}`} value={`${p + 1}`} />
                );
              })}
            </Picker>
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
