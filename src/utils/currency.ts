import { Address, PaymentCurrency } from '../types/contract';

export type SupportedCurrencies = 'USDC';
export type SupportedChains = '1' | '137' | '8453';
export const NATIVE_CURRENCY_ADDRESS =
  '0x0000000000000000000000000000000000000000';

export function getPaymentCurrency(
  currency: SupportedCurrencies,
  chainId: number,
): PaymentCurrency | undefined {
  const chainIdString = chainId.toString() as SupportedChains;
  switch (currency) {
    case 'USDC':
      if (!USDC_ADDRESSES[chainIdString]) {
        return undefined;
      }
      return {
        isNativeAsset: false,
        contractAddress: USDC_ADDRESSES[chainIdString],
        decimals: 6,
      };
    default:
      return undefined;
  }
}

export function getPermit2Address(chainId: number): Address | undefined {
  const chainIdString = chainId.toString() as SupportedChains;
  return PERMIT2_ADDRESSES[chainIdString];
}

const PERMIT2_ADDRESSES: Record<SupportedChains, Address> = {
  1: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  137: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  8453: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
};

const USDC_ADDRESSES: Record<SupportedChains, Address> = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};
