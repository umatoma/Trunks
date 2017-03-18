export function floatFormat(number, n) {
  const p = Math.pow(10, n); // eslint-disable-line
  return Math.round(number * p) / p;
}

export function nanoToMilli(nano, n) {
  return floatFormat(nano / Math.pow(1000, 2), n); // eslint-disable-line
}

export function nanoToSec(nano, n) {
  return floatFormat(nano / Math.pow(1000, 3), n); // eslint-disable-line
}
