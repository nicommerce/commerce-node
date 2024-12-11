import { APIResponse } from '../types/api.js';
import { Web3Charge } from '../types/charge.js';
import { BaseService } from './base.js';

export interface HydrateChargeResponse {
  data: Web3Charge;
}

export type HydrateChargeParams = {
  sender: string;
  chain_id: number;
};

export class HydrateChargeService extends BaseService {
  async hydrateCharge(
    charge_id: string,
    params: HydrateChargeParams,
  ): Promise<APIResponse<HydrateChargeResponse>> {
    return this.request<HydrateChargeResponse>({
      data: params,
      path: `/charges/${charge_id}/hydrate`,
      method: 'PUT',
    });
  }
}
