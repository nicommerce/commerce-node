import {
  Web3Charge,
  Web3ChargeWeb3DataContractAddresses,
  Web3ChargeWeb3DataTransferIntent,
} from '../types/charge.js';
import {
  Address,
  PaymentCurrency,
  Permit2SignatureTransferData,
  TransferIntent,
} from '../types/contract.js';

import { FeeAmount } from '@uniswap/v3-sdk';
import { bytesToHex, formatEther, parseUnits } from 'viem';

import { TransferContractFunction } from '../abi/commerceContract.js';
export const SPREAD_PERCENTAGE = 1;
const NATIVE_CURRENCY_ADDRESS = '0x0000000000000000000000000000000000000000';

function swapAndTransferUniswapV3Native(
  transferIntent: TransferIntent,
  currency: PaymentCurrency,
  amount: string,
) {
  return {
    functionName: 'swapAndTransferUniswapV3Native' as TransferContractFunction,
    args: [transferIntent, currency.uniswapFeeTier ?? FeeAmount.LOW],
    overrides: {
      value: parseUnits(amount, currency.decimals),
    },
  };
}

function transferNative(
  transferIntent: TransferIntent,
  amount: string,
  currency: PaymentCurrency,
) {
  return {
    functionName: 'transferNative' as TransferContractFunction,
    args: [transferIntent],
    overrides: {
      value: parseUnits(amount, currency.decimals),
    },
  };
}

function transferToken(
  transferIntent: TransferIntent,
  signatureTransferData: Permit2SignatureTransferData,
) {
  if (!signatureTransferData) {
    return undefined;
  }
  return {
    functionName: 'transferToken' as TransferContractFunction,
    args: [
      transferIntent,
      {
        permit: {
          permitted: {
            token: signatureTransferData.permit.permitted.token as Address,
            amount: signatureTransferData.permit.permitted.amount,
          },
          nonce: signatureTransferData.permit.nonce,
          deadline: signatureTransferData.permit.deadline,
        },
        transferDetails: {
          to: signatureTransferData.transferDetails.to as Address,
          requestedAmount:
            signatureTransferData.transferDetails.requestedAmount,
        },
        signature: signatureTransferData.signature,
      },
    ],
    overrides: {},
  };
}

function swapAndTransferUniswapV3Token(
  transferIntent: TransferIntent,
  signatureTransferData: Permit2SignatureTransferData,
  currency: PaymentCurrency,
) {
  if (!signatureTransferData) {
    return undefined;
  }
  return {
    functionName: 'swapAndTransferUniswapV3Token' as TransferContractFunction,
    args: [
      transferIntent,
      {
        permit: {
          permitted: {
            token: signatureTransferData.permit.permitted.token as Address,
            amount: signatureTransferData.permit.permitted.amount,
          },
          nonce: signatureTransferData.permit.nonce,
          deadline: signatureTransferData.permit.deadline,
        },
        transferDetails: {
          to: signatureTransferData.transferDetails.to as Address,
          requestedAmount:
            signatureTransferData.transferDetails.requestedAmount,
        },
        signature: signatureTransferData.signature,
      },
      currency.uniswapFeeTier ?? FeeAmount.LOW,
    ],
    overrides: {},
  };
}

export function inferContractFunctionDataForViem(
  transferIntent: TransferIntent,
  amount: string,
  currency: PaymentCurrency,
  signatureTransferData: Permit2SignatureTransferData,
) {
  if (currency.isNativeAsset) {
    if (transferIntent.recipientCurrency !== NATIVE_CURRENCY_ADDRESS) {
      const amountWithSpread = addSpreadAndConvertToBigInt(
        amount,
        currency.decimals,
      );

      const parsedAmountWithSpread = formatEther(amountWithSpread).toString();

      return swapAndTransferUniswapV3Native(
        transferIntent,
        currency,
        parsedAmountWithSpread,
      );
    }

    return transferNative(transferIntent, amount, currency);
  }

  if (
    transferIntent.recipientCurrency.toLowerCase() ===
    currency.contractAddress?.toLowerCase()
  ) {
    return transferToken(transferIntent, signatureTransferData);
  }

  return swapAndTransferUniswapV3Token(
    transferIntent,
    signatureTransferData,
    currency,
  );
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

function extractContractAddress(
  transferIntent: NonNullable<Web3ChargeWeb3DataTransferIntent>,
  contractAddresses: Web3ChargeWeb3DataContractAddresses,
) {
  const { chainId } = transferIntent.metadata;
  return contractAddresses[chainId] as `0x${string}`;
}

function extractTransferIntentData(
  transferIntent: NonNullable<Web3ChargeWeb3DataTransferIntent>,
): TransferIntent {
  const { deadline, feeAmount, recipientAmount, ...theRemainder } =
    transferIntent.callData;

  return {
    deadline: getUnixTimestamp(new Date(deadline)),
    recipientAmount: BigInt(recipientAmount),
    feeAmount: BigInt(feeAmount),
    ...theRemainder,
  };
}

export type ContractCallData = ReturnType<typeof getContractCallData>;

export function getContractCallData(
  amount: string,
  currency: PaymentCurrency,
  signatureTransferData: Permit2SignatureTransferData,
  charge: Web3Charge,
) {
  if (!charge?.web3Data.transferIntent) {
    return undefined;
  }
  const transferIntent = extractTransferIntentData(
    charge.web3Data.transferIntent,
  );
  const contractAddress = extractContractAddress(
    charge.web3Data.transferIntent,
    charge.web3Data.contractAddresses,
  );
  const callData = inferContractFunctionDataForViem(
    transferIntent,
    amount,
    currency,
    signatureTransferData,
  );
  if (!callData) {
    return undefined;
  }
  const { functionName, args, overrides } = callData;
  const gasLimit = (getGasLimit(functionName) * BigInt(3)) / BigInt(2);
  return { functionName, args, overrides, contractAddress, gasLimit };
}

export function getUnixTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

export function getGasLimit(functionName: string) {
  return addGasLimitMultiplier(
    GAS_LIMITS_RAW[functionName],
    GAS_LIMIT_MULTIPLIER,
  );
}

export function addGasLimitMultiplier(gasLimit: number, multiplier: number) {
  const calculatedGasLimit = parseInt((gasLimit * multiplier).toString()); // parseInt to remove decimal places
  const calculatedGasLimitBN = BigInt(calculatedGasLimit.toString());

  return calculatedGasLimitBN;
}

export function addSpreadAndConvertToBigInt(
  amount: string,
  cryptoDecimals: number,
): bigint {
  const spreadDivisor = BigInt(Math.floor(100 / SPREAD_PERCENTAGE));
  const baseConvertedAmount = trimDecimalOverflowAndConvert(
    amount,
    cryptoDecimals,
  );
  return baseConvertedAmount + baseConvertedAmount / spreadDivisor;
}

function trimDecimalOverflowAndConvert(amount: string, decimals: number) {
  if (!amount.includes('.')) return parseUnits(amount, decimals);

  const arr = amount.split('.');
  const fraction = arr[1].slice(0, decimals);
  const value = `${arr[0]}.${fraction}`;
  return parseUnits(value, decimals);
}
