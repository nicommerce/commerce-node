import { randomUUID } from 'node:crypto';
import {
  APIRequestConfig,
  APIResponse,
  JsonData,
  RequestParams,
} from '../types/api';
import { RetryOptions, SDKError, SDKErrorType } from '../types/index';
import { SDKConfig } from '../types/index';
import { URL } from 'node:url';
import { deepCamelcaseKeys, deepSnakecaseKeys } from '../utils/casing';

/**
 * Abstract base service class that provides common functionality for all API services.
 * Handles request configuration, error handling, and response transformation.
 *
 * @abstract
 * @class BaseService
 */
export abstract class BaseService {
  /**
   * Creates an instance of BaseService.
   *
   * @param {SDKConfig} config - The SDK configuration options
   * @param {RetryOptions} retryOptions - Options for request retry behavior
   */
  constructor(
    protected readonly config: SDKConfig,
    protected readonly retryOptions: RetryOptions,
  ) {}

  /**
   * Makes an HTTP request to the Coinbase Commerce API.
   * Handles URL construction, header management, and error handling.
   * Automatically transforms snake_case response keys to camelCase.
   *
   * @protected
   * @template T - The expected response data type
   * @param {APIRequestConfig} config - The request configuration object
   * @param {string} config.method - The HTTP method to use
   * @param {string} config.path - The API endpoint path
   * @param {unknown} [config.data] - Request body data
   * @param {object} [config.options] - Additional request options
   *
   * @returns {Promise<APIResponse<T>>} A promise that resolves with the API response
   *
   * @throws {SDKError} With type SERVER when the API returns a non-200 response
   * @throws {SDKError} With type UNKNOWN for network errors or other unexpected failures
   *
   * @example
   * ```typescript
   * protected async getData(): Promise<APIResponse<MyDataType>> {
   *   return this.request<MyDataType>({
   *     method: 'GET',
   *     path: '/endpoint',
   *     options: {
   *       params: { limit: 10 },
   *       timeout: 5000
   *     }
   *   });
   * }
   * ```
   */
  protected async request<T>(
    config: APIRequestConfig,
  ): Promise<APIResponse<T>> {
    try {
      const { method, path, options = {}, data } = config;
      const url = new URL(path, this.config.baseUrl);

      if (options.params) {
        for (const [key, value] of Object.entries(options.params)) {
          url.searchParams.append(key, String(value));
        }
      }

      const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        'X-CC-Api-Key': this.config.apiKey,
      };

      let convertedData: RequestParams | undefined;

      if (data) {
        convertedData = deepSnakecaseKeys(data as JsonData) as RequestParams;
        // We want to retain original casing of user-provided metadata
        if (data.metadata) {
          convertedData.metadata = data.metadata;
        }
      }

      const response = await fetch(url.toString(), {
        method,
        body: convertedData ? JSON.stringify(convertedData) : null,
        headers,
        signal: AbortSignal.timeout(options.timeout ?? 30000),
      });

      if (!response.ok) {
        throw new SDKError(
          SDKErrorType.SERVER,
          `API request failed: ${response.statusText}`,
          {
            status: response.status,
            statusText: response.statusText,
          },
        );
      }

      const responseData = await response.json();

      return {
        data: deepCamelcaseKeys(
          responseData as Record<string, unknown> | Record<string, unknown>[],
        ) as T,
        requestId: response.headers.get('X-Request-Id') ?? randomUUID(),
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof SDKError) {
        throw error;
      }
      throw new SDKError(
        SDKErrorType.UNKNOWN,
        'An unknown error occurred',
        error,
      );
    }
  }
}
