function toCamelCase(str: string): string {
  return str.replace(/[_-](\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

type JsonResponseData = Record<string, unknown> | Record<string, unknown>[];

export function deepCamelcaseKeys(input: JsonResponseData): unknown {
  if (Array.isArray(input)) {
    return input.map((item) => deepCamelcaseKeys(item));
  } else if (input !== null && typeof input === 'object') {
    return Object.keys(input).reduce(
      (acc, key) => {
        const camelCasedKey = toCamelCase(key);
        acc[camelCasedKey] = deepCamelcaseKeys(input[key] as JsonResponseData);
        return acc;
      },
      {} as { [key: string]: unknown },
    );
  }
  return input;
}
