import { SupportedChains } from '../utils/currency';

/**
 * Configuration options for the SDK
 */
export interface SDKConfig {
  /** API key for authentication */
  apiKey: string;
  /** Base URL for API requests */
  baseUrl?: string;
  /** Mapping of Chain ID to URL for RPC requests */
  rpcUrls?: Partial<Record<SupportedChains, string>>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Version of the API to use */
  version?: string;
  /** Additional headers to include in requests */
  headers?: Record<string, string>;
}

/**
 * Error types that can be thrown by the SDK
 */
export enum SDKErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom error class for SDK errors
 */
export class SDKError extends Error {
  constructor(
    public readonly type: SDKErrorType,
    public readonly message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'SDKError';
  }
}

/**
 * Response structure for paginated results
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

/**
 * Common query parameters for list operations
 */
export interface ListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Status of an operation
 */
export type OperationStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Base response interface for all operations
 */
export interface BaseResponse {
  success: boolean;
  requestId: string;
  timestamp: string;
}

/**
 * Options for configuring retries
 */
export interface RetryOptions {
  maxRetries: number;
  backoffFactor: number;
  initialDelay: number;
  maxDelay: number;
}
