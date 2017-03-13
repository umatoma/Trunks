import 'whatwg-fetch';

const doPost = (url, params) => fetch(url, {
  method: 'POST',
  body: JSON.stringify(params),
  headers: {
    'Content-Type': 'application/json',
  },
}).then((response) => {
  if (!response.ok) {
    const err = new Error(response.statusText);
    err.response = response;
    throw err;
  }
  return response.json();
});

export function postAttack(params) { // eslint-disable-line
  return doPost('/api/attack', params);
}
