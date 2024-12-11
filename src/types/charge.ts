const TIMELINE_ITEM_STATUS = {
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
  FAILED: 'FAILED',
  NEW: 'NEW',
  PENDING: 'PENDING',
  SIGNED: 'SIGNED',
  CANCELED: 'CANCELED',
} as const;

// Export the type and values separately
export type Web3ChargeTimelineItemStatus =
  (typeof TIMELINE_ITEM_STATUS)[keyof typeof TIMELINE_ITEM_STATUS];
export const TimelineItemStatus = TIMELINE_ITEM_STATUS;

const PRICING_TYPE = {
  fixed_price: 'fixed_price',
  no_price: 'no_price',
} as const;

export type Web3ChargePricingType =
  (typeof PRICING_TYPE)[keyof typeof PRICING_TYPE];
export const PricingType = PRICING_TYPE;

const CHARGE_KIND = {
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
  amount: Currency;
  feeType: string;
};

export type Web3ChargeWeb3RetailPaymentMetadata = {
  quoteId?: string;
  sourceLedgerAccountId?: string;
  sourceLedgerAccountCurrency?: string;
  twoFactorRequired?: boolean;
  sourceAmount?: Currency;
  exchangeRateWithSpread?: Currency;
  exchangeRateWithoutSpread?: Currency;
  fees?: Web3ChargeWeb3RetailPaymentMetadataFeesItem[];
  maxRetailPaymentValueUsd?: number;
  highValuePaymentCurrencies?: string[];
};

export type Web3Charge = {
  brandColor?: string;
  brandLogoUrl?: string;
  chargeKind: Web3ChargeChargeKind;
  checkout?: Web3ChargeCheckout;
  code: string;
  collectedEmail: boolean;
  confirmedAt?: string;
  createdAt: string;
  description?: string;
  expiresAt: string;
  hostedUrl: string;
  id: string;
  metadata?: Web3ChargeMetadata;
  name?: string;
  organizationName?: string;
  pricing: Web3ChargePricing;
  pricingType: Web3ChargePricingType;
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

export type Web3ChargeWeb3DataSubsidizedPaymentsChainToTokens = Record<
  string,
  unknown
>;

export type Web3ChargeWeb3DataSettlementCurrencyAddresses = {
  [key: string]: string;
};

export type Web3ChargeWeb3DataContractAddresses = { [key: string]: string };

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
  contractAddress: string;
  sender: string;
};

export type Web3ChargeWeb3DataTransferIntentCallData = {
  deadline: string;
  feeAmount: string;
  id: string;
  operator: string;
  prefix: string;
  recipient: string;
  recipientAmount: string;
  recipientCurrency: string;
  refundDestination: string;
  signature: string;
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
  local: Currency;
  settlement: Currency;
};

export type Web3ChargeMetadata = { [key: string]: string };

export type Web3ChargeCheckout = {
  id?: string;
};

export type Currency = {
  amount: string;
  currency: string;
};
