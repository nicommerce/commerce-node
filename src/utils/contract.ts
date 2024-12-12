import { ContractFunctionArgs } from 'viem';
import {
  Web3ChargeWeb3DataContractAddresses,
  Web3ChargeWeb3DataTransferIntent,
} from '../types/charge.js';
import {
  Address,
  PaymentCurrency,
  Permit2SignatureTransferData,
  TransferIntent,
} from '../types/contract.js';
import { COMMERCE_CONTRACT_ABI } from '../abi/commerceContract.js';

export const SPREAD_PERCENTAGE = 1;
const NATIVE_CURRENCY_ADDRESS = '0x0000000000000000000000000000000000000000';

export function transferToken(
  transferIntent: TransferIntent,
  signatureTransferData: Permit2SignatureTransferData,
): {
  functionName: string;
  args: ContractFunctionArgs<
    typeof COMMERCE_CONTRACT_ABI,
    'nonpayable',
    'transferToken'
  >;
} {
  return {
    functionName: 'transferToken',
    args: [
      transferIntent,
      {
        permit: {
          permitted: {
            token: signatureTransferData.permit.permitted.token,
            amount: signatureTransferData.permit.permitted.amount,
          },
          nonce: signatureTransferData.permit.nonce,
          deadline: signatureTransferData.permit.deadline,
        },
        transferDetails: {
          to: signatureTransferData.transferDetails.to,
          requestedAmount:
            signatureTransferData.transferDetails.requestedAmount,
        },
        signature: signatureTransferData.signature,
      },
    ],
  };
}

type PayableContractMethods =
  | 'transferNative'
  | 'transferToken'
  | 'swapAndTransferUniswapV3Token'
  | 'swapAndTransferUniswapV3Native';

export function inferContractFunctionFromCurrency(
  currency: PaymentCurrency,
  transferIntent: TransferIntent,
): PayableContractMethods {
  if (currency.isNativeAsset) {
    if (transferIntent.recipientCurrency !== NATIVE_CURRENCY_ADDRESS) {
      return 'swapAndTransferUniswapV3Native';
    }

    return 'transferNative';
  }

  if (
    transferIntent.recipientCurrency.toLowerCase() ===
    currency.contractAddress?.toLowerCase()
  ) {
    return 'transferToken';
  }

  return 'swapAndTransferUniswapV3Token';
}

export const GAS_LIMIT_MULTIPLIER = 1.5; // 50% buffer

export const GAS_LIMITS_RAW: Record<string, number> = {
  transferToken: 166862,
  transferNative: 101465,
  unwrapAndTransfer: 148299,
  wrapAndTransfer: 135508,
  swapAndTransferUniswapV3Token: 305590,
  swapAndTransferUniswapV3Native: 284949,
};

export function extractContractAddress(
  transferIntent: NonNullable<Web3ChargeWeb3DataTransferIntent>,
  contractAddresses: Web3ChargeWeb3DataContractAddresses,
): Address | undefined {
  const { chainId } = transferIntent.metadata;
  const contractAddress = contractAddresses[chainId];

  return contractAddress;
}

export function extractTransferIntentData(
  transferIntent: NonNullable<Web3ChargeWeb3DataTransferIntent>,
): TransferIntent {
  const { deadline, feeAmount, recipientAmount, ...theRemainder } =
    transferIntent.callData;

  return {
    deadline: BigInt(getUnixTimestamp(new Date(deadline))),
    recipientAmount: BigInt(recipientAmount),
    feeAmount: BigInt(feeAmount),
    ...theRemainder,
  };
}

export function getUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function getGasLimit(functionName: string): bigint {
  return addGasLimitMultiplier(
    GAS_LIMITS_RAW[functionName],
    GAS_LIMIT_MULTIPLIER,
  );
}

export function addGasLimitMultiplier(
  gasLimit: number,
  multiplier: number,
): bigint {
  const calculatedGasLimit = parseInt((gasLimit * multiplier).toString()); // parseInt to remove decimal places
  const calculatedGasLimitBN = BigInt(calculatedGasLimit.toString());

  return calculatedGasLimitBN;
}
