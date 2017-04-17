import 'whatwg-fetch';

const responseHandler = (response) => {
  if (response.ok) {
    return response.json();
  }

  return response.json()
    .catch(() => Promise.reject(new Error(response.statusText)))
    .then(body => Promise.reject(new Error(body.message || response.statusText)));
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

const doDelete = url => fetch(url, {
  method: 'DELETE',
}).then(responseHandler);

export function startAttack(params) {
  return doPost('/api/attack', params);
}

export function cancelAttack() {
  return doDelete('/api/attack');
}

export function deleteAttack(params) {
  return doPost('/api/attack', params);
}

export function getResultFiles() {
  return doGet('/api/results/files');
}

export function getReport(filename) {
  return doGet(`/api/reports/${filename}`);
}
