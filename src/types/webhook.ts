import { Pagination } from './common';

export type CreateWebhookParams = {
  url: string;
};

export type UpdateWebhookParams = {
  subscribedEvents: WebhookSubscribedEvents;
};

export type WebhookSubscribedEvents = {
  chargeConfirmed: boolean;
  chargeCreated: boolean;
  chargeDelayed: boolean;
  chargeFailed: boolean;
  chargePending: boolean;
  chargeResolved: boolean;
  invoiceCreated: boolean;
  invoicePaid: boolean;
  invoicePaymentPending: boolean;
  invoiceUnresolved: boolean;
  invoiceViewed: boolean;
  invoiceVoided: boolean;
};

export type WebhookSubscription = {
  id: string;
  url: string;
  subscribedEvents: WebhookSubscribedEvents;
};

export type ApiKey = {
  apiKey: string;
  createdAt: string;
  id: string;
  requestCount: number;
};

export type AutoconversionSetting = {
  autoconversionEnabled: boolean;
};

export type BusinessBranding = {
  brandColor: string;
  organizationName: string;
};

export type EmailPreferences = {
  charges: boolean;
  language: string;
  marketing: boolean;
};

export type MerchantSettings = {
  apiKeys: ApiKey[];
  autoconversionSetting: AutoconversionSetting;
  businessBranding: BusinessBranding;
  chargeKind: 'WEB3';
  cloudBackupEncryptionKeys: string[];
  defaultChargeExpirationSeconds: number;
  emailPreferences: EmailPreferences;
  enabledCryptocurrencies: string[];
  evmSettlementAddress: string;
  evmSettlement_address_type: string;
  feeRate: number;
  webhookSharedSecret: string;
  webhookSubscriptions: WebhookSubscription[];
  whitelistedDomains: string[];
};

export type Merchant = {
  availableCryptocurrencies: string[];
  createdAt: string;
  email: string;
  exchangeDepositStatus: string;
  id: string;
  localCurrency: string;
  locked: boolean;
  loginType: string;
  migrationProgress: string;
  missingWalletCryptocurrencies: string[];
  settings: MerchantSettings;
  supportEmail: string;
  supportEmailUnconfirmed: string;
  totpSetupRequired: boolean;
  walletSetupRequired: boolean;
  walletType: string;
};

export interface WebhookResponse {
  data: Merchant;
  warnings?: string[];
}

export interface WebhooksResponse {
  pagination: Pagination;
  data: Merchant[];
  warnings?: string[];
}
