import { JsonData } from '../types/api';

function toCamelCase(str: string): string {
  return str.replace(/[_-](\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

export function deepCamelcaseKeys(input: JsonData): JsonData {
  if (Array.isArray(input)) {
    return input.map((item) => deepCamelcaseKeys(item)) as JsonData;
  } else if (input !== null && typeof input === 'object') {
    return Object.keys(input).reduce(
      (acc, key) => {
        const camelCasedKey = toCamelCase(key);
        acc[camelCasedKey] = deepCamelcaseKeys(input[key] as JsonData);
        return acc;
      },
      {} as { [key: string]: unknown },
    );
  }
  return input;
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function deepSnakecaseKeys(input: JsonData): JsonData {
  if (Array.isArray(input)) {
    return input.map((item) => deepSnakecaseKeys(item)) as JsonData;
  } else if (input !== null && typeof input === 'object') {
    return Object.keys(input).reduce(
      (acc, key) => {
        const snakeCasedKey = toSnakeCase(key);
        acc[snakeCasedKey] = deepSnakecaseKeys(input[key] as JsonData);
        return acc;
      },
      {} as { [key: string]: unknown },
    );
  }
  return input;
}
