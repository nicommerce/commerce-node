import { SDKConfig, SDKError, SDKErrorType } from '../types';
import { mainnet, base, polygon, Chain } from 'viem/chains';

export function getRpcUrl(
  chainId: number,
  rpcUrls: SDKConfig['rpcUrls'],
): string | undefined {
  const chainIdString = chainId.toString() as keyof SDKConfig['rpcUrls'];
  return rpcUrls ? rpcUrls[chainIdString] : undefined;
}

export function getChainById(chainId: number): Chain {
  switch (chainId) {
    case mainnet.id:
      return mainnet;
    case polygon.id:
      return polygon;
    case base.id:
      return base;
    default:
      throw new SDKError(
        SDKErrorType.VALIDATION,
        `Unsupported chainId: ${chainId}`,
      );
  }
}
