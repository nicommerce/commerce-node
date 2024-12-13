import { erc20Abi, formatEther, parseGwei, publicActions } from 'viem';
import { APIResponse } from '../types/api';
import {
  ChargeResponse,
  ChargesResponse,
  CreateChargeParams,
  GetChargesParams,
  HydrateChargeParams,
  PayChargeParams,
  PayChargeResponse,
} from '../types/charge';
import { BaseService } from './base.service';
import { Address } from '../types/contract';
import { SDKError } from '../types';
import { SDKErrorType } from '../types';
import {
  extractContractAddress,
  extractTransferIntentData,
  getGasLimit,
  getUnixTimestamp,
  inferContractFunctionFromCurrency,
  transferToken,
} from '../utils/contract';
import { PERMIT2_ADDRESS, signPermit } from '../utils/signPermit';
import { COMMERCE_CONTRACT_ABI } from '../abi/commerceContract';
import { getPaymentCurrency } from '../utils/currency';

/**
 * Service for managing Charges within the SDK
 * Provides functionality for creating and configuring charges
 *
 * @extends {BaseService}
 */
export class ChargesService extends BaseService {
  /**
   * Creates a new charge in the Coinbase Commerce platform
   *
   * @param params - The charge creation parameters
   * @param params.pricing_type - The pricing type for the charge
   * @param params.local_price - The price information for the charge
   * @param params.name - The name of the charge
   * @param params.description - The description of the charge
   * @param params.metadata - Additional metadata for the charge
   * @param params.redirect_url - The URL to redirect to after payment
   * @param params.cancel_url - The URL to redirect to after payment cancellation
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

  /**
   * Processes a payment for a charge using Web3
   *
   * @param params - The payment parameters
   * @param params.charge - The hydrated charge to be paid
   * @param params.walletClient - The Viem wallet client for transaction signing
   * @param params.currency - The currency to use for payment (USDC)
   *
   * @returns {Promise<PayChargeResponse>} A promise that resolves to the payment transaction details
   * @property {string} transactionHash - The hash of the submitted transaction
   *
   * @example
   * ```typescript
   * const { data: charge } = await commerce.charges.hydrateCharge('charge_id', {
   *   sender: walletClient.account.address,
   *   chain_id: 1
   * });
   *
   * const paymentResult = await commerce.charges.payCharge({
   *   charge: charge.data,
   *   walletClient,
   *   currency: USDC
   * });
   *
   * console.log(`Transaction submitted: ${paymentResult.transactionHash}`);
   * ```
   *
   * @throws {SDKError} With type VALIDATION when:
   * - The charge hasn't been hydrated
   * - The wallet is not connected
   * - There's a chain ID mismatch
   * - The payment currency is not supported
   * - No commerce contract is found on the chain
   * @throws {SDKError} With type UNKNOWN for other transaction-related errors
   */
  async payCharge(params: PayChargeParams): Promise<PayChargeResponse> {
    const { charge, walletClient, currency } = params;
    if (!charge.web3Data?.transferIntent) {
      throw new SDKError(
        SDKErrorType.VALIDATION,
        'Charge has not been hydrated',
      );
    }

    const extendedClient = walletClient.extend(publicActions);
    const payerAddress = extendedClient.account?.address;

    if (!payerAddress || !extendedClient.account) {
      throw new SDKError(SDKErrorType.VALIDATION, 'Wallet not connected');
    }

    const currentChainId = await walletClient.getChainId();

    const paymentCurrency = getPaymentCurrency(currency, currentChainId);
    if (!paymentCurrency) {
      throw new SDKError(
        SDKErrorType.VALIDATION,
        `Unsupported payment currency: ${currency}`,
      );
    }

    if (currentChainId !== charge.web3Data.transferIntent.metadata.chainId) {
      throw new SDKError(
        SDKErrorType.VALIDATION,
        'Wallet/charge chainId mismatch',
      );
    }
    const transferIntent = extractTransferIntentData(
      charge.web3Data.transferIntent,
    );

    const functionName = inferContractFunctionFromCurrency(
      paymentCurrency,
      transferIntent,
    );

    if (functionName !== 'transferToken') {
      throw new SDKError(
        SDKErrorType.VALIDATION,
        `Unsupported payment currency: ${paymentCurrency.contractAddress}`,
      );
    }

    const commerceContractAddress = extractContractAddress(
      charge.web3Data.transferIntent,
      charge.web3Data.contractAddresses,
    );

    if (!commerceContractAddress) {
      throw new SDKError(
        SDKErrorType.VALIDATION,
        `No commerce contract on chain: ${currentChainId}`,
      );
    }

    const usdcBalance = await extendedClient.readContract({
      address: charge.web3Data.transferIntent.callData
        .recipientCurrency as Address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [payerAddress],
    });
    // TODO: ADD BALANCE CHECK

    const nativeBalance = await extendedClient.getBalance({
      address: payerAddress,
    });

    const totalUsdcChargeAmount =
      BigInt(charge.web3Data.transferIntent.callData.recipientAmount) +
      BigInt(charge.web3Data.transferIntent.callData.feeAmount);

    if (usdcBalance < totalUsdcChargeAmount) {
      throw new SDKError(
        SDKErrorType.VALIDATION,
        'Insufficient USDC balance for payment',
      );
    }

    const { maxFeePerGas } = await extendedClient.estimateFeesPerGas();

    const gasLimit = (getGasLimit(functionName) * BigInt(3)) / BigInt(2);

    const totalGasFee = maxFeePerGas * gasLimit;

    if (parseGwei(nativeBalance.toString()) < totalGasFee) {
      throw new SDKError(
        SDKErrorType.VALIDATION,
        `Insufficient native balance for gas fees, ${formatEther(nativeBalance, 'wei')} of ${formatEther(totalGasFee, 'gwei')} required`,
      );
    }

    const tokenAllowance = await extendedClient.readContract({
      address: paymentCurrency.contractAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [payerAddress, PERMIT2_ADDRESS],
    });

    if (tokenAllowance < totalUsdcChargeAmount) {
      const allowanceTxn = await extendedClient.writeContract({
        account: extendedClient.account,
        chain: walletClient.chain,
        address: paymentCurrency.contractAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [
          PERMIT2_ADDRESS,
          totalUsdcChargeAmount * (BigInt(11) / BigInt(10)),
        ],
      });
      const allowanceTxnReceipt =
        await extendedClient.waitForTransactionReceipt({
          hash: allowanceTxn,
        });
      if (allowanceTxnReceipt.status !== 'success') {
        throw new SDKError(
          SDKErrorType.UNKNOWN,
          'Failed to approve USDC token allowance',
        );
      }
    }

    const signatureTransferData = await signPermit({
      walletClient,
      chainId: charge.web3Data.transferIntent.metadata.chainId,
      ownerAddress: payerAddress,
      contractAddress: paymentCurrency.contractAddress,
      spenderAddress: commerceContractAddress,
      value: totalUsdcChargeAmount,
      deadline: BigInt(getUnixTimestamp(new Date(charge.expiresAt))),
    });

    const { args } = transferToken(transferIntent, signatureTransferData);

    await extendedClient.simulateContract({
      account: extendedClient.account,
      address:
        charge.web3Data.contractAddresses[
          charge.web3Data.transferIntent.metadata.chainId
        ],
      functionName: 'transferToken',
      args,
      chain: walletClient.chain,
      abi: COMMERCE_CONTRACT_ABI,
      gas: gasLimit,
    });

    const transactionHash = await extendedClient.writeContract({
      account: extendedClient.account,
      address:
        charge.web3Data.contractAddresses[
          charge.web3Data.transferIntent.metadata.chainId
        ],
      functionName,
      args,
      chain: walletClient.chain,
      abi: COMMERCE_CONTRACT_ABI,
      gas: gasLimit,
    });

    return { transactionHash };
  }
}
