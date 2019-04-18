import { API_URL } from "data/constants";

const request = (endpoint, data = null) => {
  console.info(`Request: '${endpoint}'`, data);
  if (data === null) {
    return fetch(API_URL + endpoint + "?compressed")
      .then(json => json.json())
      .catch(err => {
        console.error(err);
      });
  }
  return fetch(API_URL + endpoint + "?compressed", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(json => json.json())
    .catch(err => {
      console.error(err);
    });
};

export default request;
