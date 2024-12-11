import { APIResponse } from '../types/api.js';
import { Web3Charge } from '../types/charge.js';
import { BaseService } from './base.js';

export interface CreateChargeResponse {
  data: Web3Charge;
}

export type CreateChargeParams = {
  pricing_type: 'fixed_price' | 'no_price';
  local_price: {
    amount: string;
    currency: string;
  };
};

export class CreateChargeService extends BaseService {
  async createCharge(
    params: CreateChargeParams,
  ): Promise<APIResponse<CreateChargeResponse>> {
    return this.request<CreateChargeResponse>({
      data: params,
      path: `/charges`,
      method: 'POST',
    });
  }
}
