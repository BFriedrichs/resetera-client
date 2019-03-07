import { createElement } from "react";

const asListItem = cls => {
  return props => createElement(cls, { ...props });
};

export default asListItem;
