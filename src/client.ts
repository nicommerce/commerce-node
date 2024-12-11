// src/client.ts
import { randomUUID } from 'crypto';
import {
  SDKConfig,
  SDKError,
  SDKErrorType,
  RetryOptions,
  BaseResponse,
} from './types/index.js';

/**
 * Default configuration for the SDK
 */
const DEFAULT_CONFIG: Omit<SDKConfig, 'apiKey'> = {
  baseUrl: 'https://api.example.com',
  timeout: 30000,
  version: 'v1',
};

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  backoffFactor: 2,
  initialDelay: 1000,
  maxDelay: 30000,
};

/**
 * Main SDK client class
 */
export class SDKClient {
  private readonly config: SDKConfig;
  private readonly retryOptions: RetryOptions;

  /**
   * Creates a new instance of the SDK client
   * @param config - Configuration options for the SDK
   * @param retryOptions - Options for configuring retry behavior
   */
  constructor(
    config: Omit<Partial<SDKConfig>, 'apiKey'> & Pick<SDKConfig, 'apiKey'>,
    retryOptions: Partial<RetryOptions> = {},
  ) {
    if (!config.apiKey) {
      throw new SDKError(
        SDKErrorType.VALIDATION,
        'API key is required in configuration',
      );
    }

    // Now TypeScript knows apiKey exists and is string
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.retryOptions = {
      ...DEFAULT_RETRY_OPTIONS,
      ...retryOptions,
    };
  }

  /**
   * Initializes the SDK client
   * @returns A promise that resolves when initialization is complete
   * @throws {SDKError} If initialization fails
   */
  public async initialize(): Promise<BaseResponse> {
    try {
      // Perform any necessary initialization
      return {
        success: true,
        requestId: randomUUID(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new SDKError(
        SDKErrorType.UNKNOWN,
        'Failed to initialize SDK',
        error,
      );
    }
  }

  /**
   * Gets the current SDK configuration
   * @returns The current configuration object
   */
  public getConfig(): Readonly<SDKConfig> {
    return Object.freeze({ ...this.config });
  }

  /**
   * Gets the current retry options
   * @returns The current retry options object
   */
  public getRetryOptions(): Readonly<RetryOptions> {
    return Object.freeze({ ...this.retryOptions });
  }
}
