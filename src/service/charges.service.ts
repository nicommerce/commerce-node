import { APIResponse } from '../types/api';
import {
  ChargeResponse,
  ChargesResponse,
  CreateChargeParams,
  GetChargesParams,
  HydrateChargeParams,
} from '../types/charge';
import { BaseService } from './base.service';

export class ChargesService extends BaseService {
  /**
   * Creates a new charge in the Coinbase Commerce platform
   *
   * @param params - The charge creation parameters
   * @param params.pricing_type - The pricing type for the charge
   * @param params.local_price - The price information for the charge
   *
   * @returns {Promise<APIResponse<ChargeResponse>>} A promise that resolves to the created charge
   *
   * @example
   * ```typescript
   * const { data: charge } = await commerce.charges.createCharge({
   *   pricing_type: 'fixed_price',
   *   local_price: {
   *     amount: '100.00',
   *     currency: 'USD'
   *   }
   * });
   * ```
   *
   * @throws {SDKError} When the API request fails or validation fails
   */
  async createCharge(
    params: CreateChargeParams,
  ): Promise<APIResponse<ChargeResponse>> {
    return this.request<ChargeResponse>({
      data: params,
      path: `/charges`,
      method: 'POST',
    });
  }

  /**
   * Hydrates an existing charge with Web3 data
   *
   * @param charge_id - The unique identifier of the charge to hydrate
   * @param params - The hydration parameters
   * @param params.sender - The blockchain address of the sender
   * @param params.chain_id - The blockchain network identifier
   *
   * @returns {Promise<APIResponse<ChargeResponse>>} A promise that resolves to the hydrated charge
   *
   * @example
   * ```typescript
   * const { data: hydratedCharge } = await commerce.charges.hydrateCharge(
   *   'charge_id_123',
   *   {
   *     sender: '0x5770D0616b99E89817A8D9BDe61fddc3A941BdF7',
   *     chain_id: 1
   *   }
   * );
   * ```
   *
   * @throws {SDKError} When the API request fails, the charge is not found, or hydration fails
   */
  async hydrateCharge(
    charge_id: string,
    params: HydrateChargeParams,
  ): Promise<APIResponse<ChargeResponse>> {
    return this.request<ChargeResponse>({
      data: params,
      path: `/charges/${charge_id}/hydrate`,
      method: 'PUT',
    });
  }

  /**
   * Retrieves a specific charge by ID from the Coinbase Commerce platform
   *
   * @param charge_id - The unique identifier of the charge to retrieve
   * @returns {Promise<APIResponse<ChargeResponse>>} A promise that resolves to the charge details
   *
   * @example
   * ```typescript
   * const { data: charge } = await commerce.charges.getCharge('charge_id_123');
   * console.log(charge.data.status);
   * ```
   *
   * @throws {SDKError} When the API request fails or the charge is not found
   */
  async getCharge(charge_id: string): Promise<APIResponse<ChargeResponse>> {
    return this.request<ChargeResponse>({
      path: `/charges/${charge_id}`,
      method: 'GET',
    });
  }

  /**
   * Retrieves a list of charges from the Coinbase Commerce platform
   *
   * @param [params] - Optional parameters for the list request
   * @param [params.limit] - Maximum number of charges to return (default: 25)
   * @param [params.starting_after] - Cursor for pagination: retrieves results after this charge ID
   * @param [params.ending_before] - Cursor for pagination: retrieves results before this charge ID
   * @param [params.order] - Sort order for results ('desc' | 'asc')
   *
   * @returns {Promise<APIResponse<ChargesResponse>>} A promise that resolves to a paginated list of charges
   *
   * @example
   * ```typescript
   * // Get first page of charges
   * const { data: charges } = await commerce.charges.getCharges({
   *   limit: 10,
   *   order: 'desc'
   * });
   *
   * // Get next page using cursor
   * const nextPage = await commerce.charges.getCharges({
   *   starting_after: charges.pagination.cursor_range[1]
   * });
   * ```
   *
   * @throws {SDKError} When the API request fails or invalid parameters are provided
   */
  async getCharges(
    params?: GetChargesParams,
  ): Promise<APIResponse<ChargesResponse>> {
    return this.request<ChargesResponse>({
      path: `/charges`,
      method: 'GET',
      options: {
        params: params as Record<string, string | number | boolean>,
      },
    });
  }
}
