import { FeeAmount } from '@uniswap/v3-sdk';
import { Web3ChargeWeb3DataTransferIntentCallData } from './charge.js';

type SignatureTransferDetails = {
  to: string;
  requestedAmount: bigint;
};

export type Permit2SignatureTransferData = {
  permit: PermitTransferFrom;
  transferDetails: SignatureTransferDetails;
  // Note: signature is required
  // We need to add as optional here because some uses of type will not have field
  signature?: string;
};

type DecoratedIntentValues = {
  deadline: number;
  feeAmount: bigint;
  recipientAmount: bigint;
};

export type TransferIntent = Omit<
  Web3ChargeWeb3DataTransferIntentCallData,
  keyof DecoratedIntentValues
> &
  DecoratedIntentValues;

export interface TokenPermissions {
  token: string;
  amount: bigint;
}
export interface PermitTransferFrom {
  permitted: TokenPermissions;
  spender: string;
  nonce: bigint;
  deadline: bigint;
}

export type Address = `0x${string}`;

export interface PaymentCurrency {
  isNativeAsset: boolean;
  contractAddress?: string;
  decimals: number;
  uniswapFeeTier?: FeeAmount;
}
