module.exports = {
  extends: 'airbnb',
  globals: {
    document: true,
    fetch: true,
    window: true,
    WebSocket: true,
    location: true,
  },
  rules: {
    'react/forbid-prop-types': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
  }
}
