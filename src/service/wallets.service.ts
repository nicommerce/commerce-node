import { createWalletClient, http, publicActions, WalletClient } from 'viem';
import { BaseService } from './base.service';
import { mnemonicToAccount } from 'viem/accounts';
import { getChainById, getRpcUrl } from '../utils/chains';
import { SDKError, SDKErrorType } from '../types';

export type CreateWalletParams = {
  secretWords: string;
  chainId: number;
};

export class WalletsService extends BaseService {
  createWallet(params: CreateWalletParams): WalletClient {
    if (!this.config.baseRpcUrl) {
      throw new SDKError(SDKErrorType.VALIDATION, 'baseRpcUrl not set');
    }
    const chain = getChainById(params.chainId);
    const account = mnemonicToAccount(params.secretWords);

    return createWalletClient({
      account,
      chain,
      transport: http(getRpcUrl(params.chainId, this.config.baseRpcUrl)),
    }).extend(publicActions);
  }
}
