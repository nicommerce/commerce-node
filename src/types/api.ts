export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
};

export type APIResponse<T = unknown> = {
  data: T;
  requestId: string;
  success: boolean;
  timestamp: string;
};

export type JsonData = Record<string, unknown> | Record<string, unknown>[];
export type RequestParams = Record<string, unknown> & {
  metadata?: Record<string, unknown>;
};

export type APIRequestConfig = {
  method: HTTPMethod;
  path: string;
  options?: RequestOptions;
  data?: RequestParams;
};
