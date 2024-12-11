import { BaseResponse } from './index.js';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

export interface APIResponse<T = unknown> extends BaseResponse {
  data: T;
}

export interface APIRequestConfig {
  method: HTTPMethod;
  path: string;
  options?: RequestOptions;
  data?: unknown;
}
