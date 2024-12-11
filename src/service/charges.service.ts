import { APIResponse } from '../types/api';
import { Web3Charge } from '../types/charge';
import { BaseService } from './base.service';

export interface CommerceResponse {
  data: Web3Charge;
}

export type CreateChargeParams = {
  pricing_type: 'fixed_price' | 'no_price';
  local_price: {
    amount: string;
    currency: string;
  };
};

export type HydrateChargeParams = {
  sender: string;
  chain_id: number;
};

export class ChargesService extends BaseService {
  async createCharge(
    params: CreateChargeParams,
  ): Promise<APIResponse<CommerceResponse>> {
    return this.request<CommerceResponse>({
      data: params,
      path: `/charges`,
      method: 'POST',
    });
  }

  async hydrateCharge(
    charge_id: string,
    params: HydrateChargeParams,
  ): Promise<APIResponse<CommerceResponse>> {
    return this.request<CommerceResponse>({
      data: params,
      path: `/charges/${charge_id}/hydrate`,
      method: 'PUT',
    });
  }
}
