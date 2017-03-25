import toml from 'toml';

const tomlToObject = data => toml.parse(data);

export function convertToObject(data, format = 'toml') { // eslint-disable-line
  switch (format) {
    case 'toml':
      return tomlToObject(data);
    default:
      throw new Error(`${format} is unsupported format`);
  }
}
