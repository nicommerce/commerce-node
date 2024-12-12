import { APIResponse } from '../types/api';
import {
  ChargesResponse,
  CreateChargeParams,
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
   * @returns {Promise<APIResponse<ChargesResponse>>} A promise that resolves to the created charge
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
  ): Promise<APIResponse<ChargesResponse>> {
    return this.request<ChargesResponse>({
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
   * @returns {Promise<APIResponse<ChargesResponse>>} A promise that resolves to the hydrated charge
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
  ): Promise<APIResponse<ChargesResponse>> {
    return this.request<ChargesResponse>({
      data: params,
      path: `/charges/${charge_id}/hydrate`,
      method: 'PUT',
    });
  }

  /**
   * Retrieves a specific charge by ID from the Coinbase Commerce platform
   *
   * @param charge_id - The unique identifier of the charge to retrieve
   * @returns {Promise<APIResponse<ChargesResponse>>} A promise that resolves to the charge details
   *
   * @example
   * ```typescript
   * const { data: charge } = await commerce.charges.getCharge('charge_id_123');
   * console.log(charge.data.status);
   * ```
   *
   * @throws {SDKError} When the API request fails or the charge is not found
   */
  async getCharge(charge_id: string): Promise<APIResponse<ChargesResponse>> {
    return this.request<ChargesResponse>({
      path: `/charges/${charge_id}`,
      method: 'GET',
    });
  }
}
