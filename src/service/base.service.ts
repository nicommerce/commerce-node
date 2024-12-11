import { randomUUID } from 'node:crypto';
import { APIRequestConfig, APIResponse } from '../types/api';
import { RetryOptions, SDKError, SDKErrorType } from '../types/index';
import { SDKConfig } from '../types/index';
import { URL } from 'node:url';

export abstract class BaseService {
  constructor(
    protected readonly config: SDKConfig,
    protected readonly retryOptions: RetryOptions,
  ) {}

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
      const response = await fetch(url.toString(), {
        method,
        body: data ? JSON.stringify(data) : null,
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
        data: responseData as T,
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
