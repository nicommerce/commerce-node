import { createWalletClient, http, publicActions, WalletClient } from 'viem';
import { BaseService } from './base.service';
import { mnemonicToAccount } from 'viem/accounts';
import { getChainById, getRpcUrl } from '../utils/chains';
import { SDKError, SDKErrorType } from '../types';
import { CreateWalletParams } from '../types/wallet';

/**
 * Service for managing Web3 wallets within the SDK
 * Provides functionality for creating and configuring wallet clients
 *
 * @extends {BaseService}
 */
export class WalletsService extends BaseService {
  /**
   * Creates a new Viem wallet client configured for a specific chain
   *
   * @param params - The wallet creation parameters
   * @param params.secretWords - The mnemonic phrase (seed words) for the wallet
   * @param params.chainId - The ID of the blockchain network to connect to
   *
   * @returns {WalletClient} A configured Viem wallet client with public actions enabled
   *
   * @example
   * ```typescript
   * const wallet = commerce.wallets.createWallet({
   *   secretWords: 'word1 word2 ... word12',
   *   chainId: 1 // Ethereum mainnet
   * });
   *
   * // The wallet is ready to use with other services
   * const address = wallet.account.address;
   * ```
   *
   * @throws {SDKError} With type VALIDATION when baseRpcUrl is not configured in the SDK
   * @throws {SDKError} When the chain ID is not supported or the mnemonic is invalid
   */
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
