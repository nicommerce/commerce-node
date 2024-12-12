import { APIResponse } from '../types/api';
import { BaseService } from './base.service';
import {
  CheckoutResponse,
  CheckoutsResponse,
  CreateCheckoutParams,
  GetCheckoutsParams,
} from '../types/checkout';

/**
 * Service for managing Checkouts within the SDK
 * Provides functionality for creating and configuring checkouts
 *
 * @extends {BaseService}
 */
export class CheckoutsService extends BaseService {
  /**
   * Creates a new checkout in the Coinbase Commerce platform
   *
   * @param params - The checkout creation parameters
   * @param params.name - The name of the checkout
   * @param params.description - The description of the checkout
   * @param params.pricing_type - The pricing type for the checkout
   * @param params.logo_url - The URL for the checkout's logo
   * @param params.extended_description - Additional description for the checkout
   * @param params.local_price - The price information for the checkout
   * @param params.requested_info - Array of information to request from the buyer
   *
   * @returns {Promise<APIResponse<CheckoutResponse>>} A promise that resolves to the created checkout
   *
   * @example
   * ```typescript
   * const { data: checkout } = await commerce.checkouts.createCheckout({
   *   name: 'Test Checkout',
   *   description: 'Test checkout description',
   *   pricing_type: 'fixed_price',
   *   local_price: {
   *     amount: '100.00',
   *     currency: 'USD'
   *   },
   *   requested_info: ['email']
   * });
   * ```
   *
   * @throws {SDKError} When the API request fails or validation fails
   */
  async createCheckout(
    params: CreateCheckoutParams,
  ): Promise<APIResponse<CheckoutResponse>> {
    return this.request<CheckoutResponse>({
      data: params,
      path: '/checkouts',
      method: 'POST',
    });
  }

  /**
   * Retrieves a specific checkout by ID from the Coinbase Commerce platform
   *
   * @param checkout_id - The unique identifier of the checkout to retrieve
   * @returns {Promise<APIResponse<CheckoutResponse>>} A promise that resolves to the checkout details
   *
   * @example
   * ```typescript
   * const { data: checkout } = await commerce.checkouts.getCheckout('a3f457b7-2a06-4268-a97c-989c58d908fd');
   * console.log(checkout.data.name); // "Test Checkout"
   * ```
   *
   * @throws {SDKError} When the API request fails or the checkout is not found
   */
  async getCheckout(
    checkout_id: string,
  ): Promise<APIResponse<CheckoutResponse>> {
    return this.request<CheckoutResponse>({
      path: `/checkouts/${checkout_id}`,
      method: 'GET',
    });
  }

  /**
   * Retrieves a list of checkouts from the Coinbase Commerce platform
   *
   * @param [params] - Optional parameters for the list request
   * @param [params.limit] - Maximum number of checkouts to return (default: 25)
   * @param [params.starting_after] - Cursor for pagination: retrieves results after this checkout ID
   * @param [params.ending_before] - Cursor for pagination: retrieves results before this checkout ID
   * @param [params.order] - Sort order for results ('desc' | 'asc')
   *
   * @returns {Promise<APIResponse<CheckoutsResponse>>} A promise that resolves to a paginated list of checkouts
   *
   * @example
   * ```typescript
   * // Get first page of checkouts
   * const { data: checkoutsList } = await commerce.checkouts.getCheckouts({
   *   limit: 10,
   *   order: 'desc'
   * });
   *
   * // Get next page using cursor
   * const nextPage = await commerce.checkouts.getCheckouts({
   *   starting_after: checkoutsList.pagination.cursor_range[1]
   * });
   * ```
   *
   * @throws {SDKError} When the API request fails or invalid parameters are provided
   */
  async getCheckouts(
    params?: GetCheckoutsParams,
  ): Promise<APIResponse<CheckoutsResponse>> {
    return this.request<CheckoutsResponse>({
      path: '/checkouts',
      method: 'GET',
      options: {
        params: params as Record<string, string | number | boolean>,
      },
    });
  }
}
