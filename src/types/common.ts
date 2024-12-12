export const PRICING_TYPE = {
  fixed_price: 'fixed_price',
  no_price: 'no_price',
} as const;

export type PricingType = (typeof PRICING_TYPE)[keyof typeof PRICING_TYPE];
export const PricingTypes = PRICING_TYPE;

export type Price = {
  amount: string;
  currency: string;
};

export interface BaseMetadata {
  [key: string]: string | undefined;
}

export interface BaseResource {
  id: string;
  brand_color?: string;
  brand_logo_url?: string;
  name?: string;
  description?: string;
  organization_name?: string;
  pricing_type: PricingType;
}
