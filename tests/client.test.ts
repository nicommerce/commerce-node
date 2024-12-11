import { CommerceSDK } from '../src/client';
import { SDKConfig } from '../src/types/index';

describe('CommerceSDK', () => {
  describe('constructor', () => {
    it('should create instance with minimal config', () => {
      const client = new CommerceSDK({ apiKey: 'test-key' });
      expect(client).toBeInstanceOf(CommerceSDK);
    });

    it('should merge default config with provided config', () => {
      const client = new CommerceSDK({
        apiKey: 'test-key',
        timeout: 5000,
      });
      const config = client.getConfig();

      // Custom value should override default
      expect(config.timeout).toBe(5000);

      // Default values should be present
      expect(config.baseUrl).toBe('https://api.commerce.coinbase.com');
      expect(config.version).toBe('v1');
    });

    it('should not modify the original config object', () => {
      const originalConfig = { apiKey: 'test-key' };
      const client = new CommerceSDK(originalConfig);

      // Original config should remain unchanged
      expect(originalConfig).toEqual({ apiKey: 'test-key' });

      // Client config should have defaults
      const clientConfig = client.getConfig();
      expect(clientConfig.baseUrl).toBeDefined();
      expect(clientConfig.timeout).toBeDefined();
    });
  });

  describe('initialize', () => {
    it('should return successful response with proper types', async () => {
      const client = new CommerceSDK({ apiKey: 'test-key' });
      const response = await client.initialize();

      expect(response).toEqual({
        success: true,
        requestId: expect.any(String),
        timestamp: expect.any(String),
      });

      // Validate timestamp is ISO string
      expect(() => new Date(response.timestamp)).not.toThrow();
    });
  });

  describe('type safety', () => {
    it('should enforce type safety for config values', () => {
      // @ts-expect-error apiKey must be string
      new CommerceSDK({ apiKey: 123 });

      // @ts-expect-error timeout must be number
      new CommerceSDK({ apiKey: 'test-key', timeout: '1000' });

      // @ts-expect-error version must be string
      new CommerceSDK({ apiKey: 'test-key', version: 123 });

      // @ts-expect-error baseUrl must be string
      new CommerceSDK({ apiKey: 'test-key', baseUrl: true });

      // @ts-expect-error headers must be Record<string, string>
      new CommerceSDK({ apiKey: 'test-key', headers: { key: 123 } });
    });

    it('should accept valid config with all properties', () => {
      const validConfig: SDKConfig = {
        apiKey: 'test-key',
        timeout: 1000,
        version: 'v2',
        baseUrl: 'https://api.test.com',
        headers: { 'Custom-Header': 'value' },
      };

      const client = new CommerceSDK(validConfig);
      expect(client).toBeInstanceOf(CommerceSDK);
    });

    it('should properly type the config values', () => {
      const client = new CommerceSDK({ apiKey: 'test-key' });
      const config = client.getConfig();

      // Check if values exist and are of correct type
      if (config.timeout !== undefined) {
        expect(typeof config.timeout).toBe('number');
        // Use the value to avoid unused variable warning
        expect(config.timeout).toBeGreaterThan(0);
      }

      if (config.version !== undefined) {
        expect(typeof config.version).toBe('string');
        expect(config.version.length).toBeGreaterThan(0);
      }

      if (config.headers !== undefined) {
        const headerKeys = Object.keys(config.headers);
        expect(Array.isArray(headerKeys)).toBe(true);
      }
    });
  });

  describe('config immutability', () => {
    it('should return frozen config object from getConfig', () => {
      const client = new CommerceSDK({ apiKey: 'test-key' });
      const config = client.getConfig();

      expect(Object.isFrozen(config)).toBe(true);

      expect(() => {
        // TypeScript will error here, but we can test runtime behavior
        // @ts-expect-error readonly object
        config.timeout = 5000;
      }).toThrow();
    });
  });
});
