import { createWalletClient, http, publicActions, WalletClient } from 'viem';
import { BaseService } from './base.service';
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';
import { getChainById, getRpcUrl } from '../utils/chains';
import { SDKError, SDKErrorType } from '../types';
import { CreateWalletParams } from '../types/wallet';
import { Address } from '../types/contract';

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
   * @param params.privateKey - The private key for the wallet
   * @param params.chainId - The ID of the blockchain network to connect to
   *
   * @returns {WalletClient} A configured Viem wallet client with public actions enabled
   *
   * @example Create a new wallet client with a mnemonic phrase
   * ```typescript
   * const wallet = commerce.wallets.createWallet({
   *   secretWords: 'word1 word2 ... word12',
   *   chainId: 1 // Ethereum mainnet
   * });
   *
   * // The wallet is ready to use with other services
   * const address = wallet.account.address;
   * ```
   * @example Create a new wallet client with a private key
   * ```typescript
   * const wallet = commerce.wallets.createWallet({
   *   privateKey: '0x...23a',
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
    const { secretWords, chainId, privateKey } = params;
    if (!this.config.baseRpcUrl) {
      throw new SDKError(SDKErrorType.VALIDATION, 'baseRpcUrl not set');
    }
    const chain = getChainById(chainId);
    if (!secretWords && !privateKey) {
      throw new SDKError(
        SDKErrorType.VALIDATION,
        'cannot create wallet without secretWords or privateKey',
      );
    }
    const account = secretWords
      ? mnemonicToAccount(secretWords)
      : privateKeyToAccount(privateKey as Address);

    return createWalletClient({
      account,
      chain,
      transport: http(getRpcUrl(params.chainId, this.config.baseRpcUrl)),
    }).extend(publicActions);
  }
}
