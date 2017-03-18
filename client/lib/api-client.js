import 'whatwg-fetch';

const responseHandler = (response) => {
  if (!response.ok) {
    const err = new Error(response.statusText);
    err.response = response;
    throw err;
  }
  return response.json();
};

const doGet = url => fetch(url, {
  method: 'GET',
}).then(responseHandler);

const doPost = (url, params) => fetch(url, {
  method: 'POST',
  body: JSON.stringify(params),
  headers: {
    'Content-Type': 'application/json',
  },
}).then(responseHandler);

export function postAttack(params) {
  return doPost('/api/attack', params);
}

export function getResultFiles() {
  return doGet('/api/results/files');
}

export function getReport(filename) {
  return doGet(`/api/reports/${filename}`);
}
