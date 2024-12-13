import { Pagination, Price, PricingType } from './common';

export type RequestedInfoItem =
  | 'name'
  | 'email'
  | 'address'
  | 'phone'
  | 'employer'
  | 'occupation';

export type CreateCheckoutParams = {
  name?: string;
  description?: string;
  pricingType: PricingType;
  logoUrl?: string;
  extendedDescription?: string;
  localPrice: Price;
  buyerLocale?: string;
  metadata?: Record<string, unknown>;
  requestedInfo?: RequestedInfoItem[];
};

export type Checkout = {
  brandColor?: string;
  coinbaseManagedMerchant: boolean;
  description?: string;
  id: string;
  localPrice: Price;
  name?: string;
  organizationName: string;
  pricingType: PricingType;
  requestedInfo?: RequestedInfoItem[];
  resource: string;
};

export interface CheckoutResponse {
  data: Checkout;
  warnings?: string[];
}

export interface CheckoutsResponse {
  pagination: Pagination;
  data: Checkout[];
  warnings?: string[];
}

// Optional: Query parameters type for the list method
export interface GetCheckoutsParams {
  limit?: number;
  startingAfter?: string;
  endingBefore?: string;
  order?: 'desc' | 'asc';
}
