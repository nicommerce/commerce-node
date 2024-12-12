import { Pagination } from './common';

export type CreateWebhookParams = {
  url: string;
};

export type UpdateWebhookParams = {
  subscribed_events: WebhookSubscribedEvents;
};

export type WebhookSubscribedEvents = {
  charge_confirmed: boolean;
  charge_created: boolean;
  charge_delayed: boolean;
  charge_failed: boolean;
  charge_pending: boolean;
  charge_resolved: boolean;
  invoice_created: boolean;
  invoice_paid: boolean;
  invoice_payment_pending: boolean;
  invoice_unresolved: boolean;
  invoice_viewed: boolean;
  invoice_voided: boolean;
};

export type WebhookSubscription = {
  id: string;
  url: string;
  subscribed_events: WebhookSubscribedEvents;
};

export type ApiKey = {
  api_key: string;
  created_at: string;
  id: string;
  request_count: number;
};

export type AutoconversionSetting = {
  autoconversion_enabled: boolean;
};

export type BusinessBranding = {
  brand_color: string;
  organization_name: string;
};

export type EmailPreferences = {
  charges: boolean;
  language: string;
  marketing: boolean;
};

export type MerchantSettings = {
  api_keys: ApiKey[];
  autoconversion_setting: AutoconversionSetting;
  business_branding: BusinessBranding;
  charge_kind: 'WEB3';
  cloud_backup_encryption_keys: string[];
  default_charge_expiration_seconds: number;
  email_preferences: EmailPreferences;
  enabled_cryptocurrencies: string[];
  evm_settlement_address: string;
  evm_settlement_address_type: string;
  fee_rate: number;
  webhook_shared_secret: string;
  webhook_subscriptions: WebhookSubscription[];
  whitelisted_domains: string[];
};

export type Merchant = {
  available_cryptocurrencies: string[];
  created_at: string;
  email: string;
  exchange_deposit_status: string;
  id: string;
  local_currency: string;
  locked: boolean;
  login_type: string;
  migration_progress: string;
  missing_wallet_cryptocurrencies: string[];
  settings: MerchantSettings;
  support_email: string;
  support_email_unconfirmed: string;
  totp_setup_required: boolean;
  wallet_setup_required: boolean;
  wallet_type: string;
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
