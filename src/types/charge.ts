import { WalletClient } from 'viem';
import { BaseResource, BaseMetadata, Price, Pagination } from './common';

import { Address } from './contract';
import { SupportedCurrencies } from '../utils/currency';

export const TIMELINE_ITEM_STATUS = {
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
  FAILED: 'FAILED',
  NEW: 'NEW',
  PENDING: 'PENDING',
  SIGNED: 'SIGNED',
  CANCELED: 'CANCELED',
} as const;

export type Web3ChargeTimelineItemStatus =
  (typeof TIMELINE_ITEM_STATUS)[keyof typeof TIMELINE_ITEM_STATUS];
export const TimelineItemStatus = TIMELINE_ITEM_STATUS;

export const CHARGE_KIND = {
  WEB3: 'WEB3',
} as const;

export type Web3ChargeChargeKind =
  (typeof CHARGE_KIND)[keyof typeof CHARGE_KIND];
export const ChargeKind = CHARGE_KIND;

export type Web3ChargeTimelineItem = {
  status: Web3ChargeTimelineItemStatus;
  time: string;
};

export type Web3ChargeWeb3RetailPaymentMetadataFeesItem = {
  title: string;
  amount: Price;
  feeType: string;
};

export type Web3ChargeWeb3RetailPaymentMetadata = {
  quoteId?: string;
  sourceLedgerAccountId?: string;
  sourceLedgerAccountCurrency?: string;
  twoFactorRequired?: boolean;
  sourceAmount?: Price;
  exchangeRateWithSpread?: Price;
  exchangeRateWithoutSpread?: Price;
  fees?: Web3ChargeWeb3RetailPaymentMetadataFeesItem[];
  maxRetailPaymentValueUsd?: number;
  highValuePaymentCurrencies?: string[];
};

export type Web3Charge = BaseResource & {
  chargeKind: Web3ChargeChargeKind;
  checkout?: Web3ChargeCheckout;
  code: string;
  collectedEmail: boolean;
  confirmedAt?: string;
  createdAt: string;
  expiresAt: string;
  hostedUrl: string;
  metadata?: BaseMetadata;
  pricing: {
    local: Price;
    settlement: Price;
  };
  pwcbOnly?: boolean;
  ocsPointsOverride?: boolean;
  redirects?: Web3ChargeRedirects;
  supportEmail: string;
  thirdPartyProvider?: string;
  timeline: Web3ChargeTimelineItem[];
  web3Data: Web3ChargeWeb3Data;
  web3RetailPaymentsEnabled: boolean;
  web3RetailPaymentMetadata?: Web3ChargeWeb3RetailPaymentMetadata;
};

export interface ChargeResponse {
  data: Web3Charge;
  warnings?: string[];
}

export interface ChargesResponse {
  pagination: Pagination;
  data: Web3Charge[];
  warnings?: string[];
}

export type CreateChargeParams = {
  name?: string;
  description?: string;
  pricingType: 'fixed_price' | 'no_price';
  metadata?: Record<string, unknown>;
  redirectUrl?: string;
  cancelUrl?: string;
  localPrice: {
    amount: string;
    currency: string;
  };
};

export type HydrateChargeParams = {
  sender: string;
  chainId: number;
};

// Optional: Query parameters type for the list method
export interface GetChargesParams {
  limit?: number;
  startingAfter?: string;
  endingBefore?: string;
  order?: 'desc' | 'asc';
}

export type Web3ChargeWeb3DataSubsidizedPaymentsChainToTokens = Record<
  string,
  unknown
>;

export type Web3ChargeWeb3DataSettlementCurrencyAddresses = {
  [key: string]: string;
};

export type Web3ChargeWeb3DataContractAddresses = { [key: string]: Address };

export type Web3ChargeWeb3Data = {
  failureEvents: Web3ChargeWeb3DataFailureEventsItem[];
  successEvents: Web3ChargeWeb3DataSuccessEventsItem[];
  transferIntent?: Web3ChargeWeb3DataTransferIntent;
  /** @deprecated */
  contractAddress?: string;
  contractAddresses: Web3ChargeWeb3DataContractAddresses;
  settlementCurrencyAddresses?: Web3ChargeWeb3DataSettlementCurrencyAddresses;
  subsidizedPaymentsChainToTokens?: Web3ChargeWeb3DataSubsidizedPaymentsChainToTokens;
};

export type Web3ChargeWeb3DataTransferIntentMetadata = {
  chainId: number;
  /** @deprecated */
  contractAddress: Address;
  sender: Address;
};

export type Web3ChargeWeb3DataTransferIntentCallData = {
  deadline: string;
  feeAmount: string;
  id: Address;
  operator: Address;
  prefix: Address;
  recipient: Address;
  recipientAmount: string;
  recipientCurrency: Address;
  refundDestination: Address;
  signature: Address;
};

export type Web3ChargeWeb3DataTransferIntent = {
  callData: Web3ChargeWeb3DataTransferIntentCallData;
  metadata: Web3ChargeWeb3DataTransferIntentMetadata;
} | null;

export type Web3ChargeWeb3DataSuccessEventsItem = {
  chainId: number;
  finalized: boolean;
  inputTokenAddress: string;
  inputTokenAmount: string;
  networkFeePaid: string;
  networkFeePaidLocal?: string;
  recipient: string;
  sender: string;
  timestamp: string;
  txHsh: string;
};

export type Web3ChargeWeb3DataFailureEventsItem = {
  chainId?: number;
  inputTokenAddress?: string;
  networkFeePaid?: string;
  reason?: string;
  sender?: string;
  timestamp?: string;
  txHsh?: string;
};

export type Web3ChargeRedirects = {
  cancelUrl?: string;
  successUrl?: string;
  willRedirectAfterSuccess?: boolean;
};

export type Web3ChargePricing = {
  local: Price;
  settlement: Price;
};

export type Web3ChargeMetadata = BaseMetadata;

export type Web3ChargeCheckout = {
  id?: string;
};

export type PayChargeParams = {
  charge: Web3Charge;
  walletClient: WalletClient;
  currency: SupportedCurrencies;
};

export type PayChargeResponse = {
  transactionHash: string;
};
