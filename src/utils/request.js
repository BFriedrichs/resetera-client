import { API_URL } from "data/constants";

const request = (endpoint, data = null) => {
  console.log(endpoint);
  if (data === null) {
    return fetch(API_URL + endpoint + "?compressed")
      .then(json => json.json())
      .catch(err => {
        console.log(err);
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
      console.log(err);
    });
};

export default request;
