import { API_URL } from "data/constants";

const request = endpoint => {
  return fetch(API_URL + endpoint)
    .then(json => json.json())
    .catch(err => {
      console.err(err);
    });
};

export default request;
