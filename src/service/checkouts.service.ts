import { APIResponse } from '../types/api';
import { BaseService } from './base.service';
import {
  CheckoutsResponse,
  CreateCheckoutParams,
  GetCheckoutsParams,
  GetCheckoutsResponse,
} from '../types/checkout';

export class CheckoutsService extends BaseService {
  /**
   * Creates a new checkout in the Coinbase Commerce platform
   *
   * @param params - The checkout creation parameters
   * @param params.pricing_type - The pricing type for the checkout ('fixed_price' | 'no_price')
   * @param params.total_price - The price information for the checkout
   * @param params.total_price.amount - The amount in the specified currency
   * @param params.total_price.currency - The currency code (e.g., 'USD')
   * @param [params.buyer_locale] - The locale for the buyer's checkout experience
   * @param [params.metadata] - Additional metadata for the checkout
   * @param [params.metadata.custom_field] - First custom field
   * @param [params.metadata.custom_field_two] - Second custom field
   * @param [params.requested_info] - Information to request from the buyer ('name' | 'email' | 'address' | 'phone' | 'employer' | 'occupation')
   *
   * @returns {Promise<APIResponse<CheckoutsResponse>>} A promise that resolves to the created checkout
   *
   * @example
   * ```typescript
   * const { data: checkout } = await commerce.checkouts.createCheckout({
   *   pricing_type: 'fixed_price',
   *   local_price: {
   *     amount: '100.00',
   *     currency: 'USD',
   *   },
   *   name: 'Test Checkout',
   *   description: 'Test checkout description',
   *   requested_info: ['email'],
   * });
   * ```
   *
   * @throws {SDKError} When the API request fails or validation fails
   */
  async createCheckout(
    params: CreateCheckoutParams,
  ): Promise<APIResponse<CheckoutsResponse>> {
    return this.request<CheckoutsResponse>({
      data: params,
      path: '/checkouts',
      method: 'POST',
    });
  }

  /**
   * Retrieves a specific checkout by ID from the Coinbase Commerce platform
   *
   * @param checkout_id - The unique identifier of the checkout to retrieve
   * @returns {Promise<APIResponse<CheckoutsResponse>>} A promise that resolves to the checkout details
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
  ): Promise<APIResponse<CheckoutsResponse>> {
    return this.request<CheckoutsResponse>({
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
   * @returns {Promise<APIResponse<GetCheckoutsResponse>>} A promise that resolves to a paginated list of checkouts
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
  ): Promise<APIResponse<GetCheckoutsResponse>> {
    return this.request<GetCheckoutsResponse>({
      path: '/checkouts',
      method: 'GET',
      options: {
        params: params as Record<string, string | number | boolean>,
      },
    });
  }
}
