import { Price, PricingType } from './common';

export type RequestedInfoItem =
  | 'name'
  | 'email'
  | 'address'
  | 'phone'
  | 'employer'
  | 'occupation';

export type CheckoutMetadata = {
  custom_field?: string;
  custom_field_two?: string;
};

export type CreateCheckoutParams = {
  name?: string;
  description?: string;
  pricing_type: PricingType;
  logo_url?: string;
  extended_description?: string;
  local_price: Price;
  buyer_locale?: string;
  metadata?: CheckoutMetadata;
  requested_info?: RequestedInfoItem[];
};

export type Checkout = {
  brand_color?: string;
  coinbase_managed_merchant: boolean;
  description?: string;
  id: string;
  local_price: Price;
  name?: string;
  organization_name: string;
  pricing_type: PricingType;
  requested_info?: RequestedInfoItem[];
  resource: string;
};

export interface CheckoutsResponse {
  data: Checkout;
  warnings?: string[];
}

export interface CheckoutPagination {
  order: 'desc' | 'asc';
  starting_after: string | null;
  ending_before: string | null;
  total: number;
  limit: number;
  yielded: number;
  cursor_range: [string, string];
  previous_uri: string;
  next_uri: string;
}

export interface GetCheckoutsResponse {
  pagination: CheckoutPagination;
  data: Checkout[];
  warnings?: string[];
}

// Optional: Query parameters type for the list method
export interface GetCheckoutsParams {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
  order?: 'desc' | 'asc';
}
