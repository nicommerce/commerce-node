import { SDKError, SDKErrorType } from '../types';
import { mainnet, base, polygon, Chain } from 'viem/chains';

export function getRpcUrl(chainId: number, baseRpcUrl: string): string {
  const clientId = 'commerce%2Ffrontend';
  let networkName;

  switch (chainId) {
    case mainnet.id:
      networkName = 'ethereum-mainnet';
      break;
    case polygon.id:
      networkName = 'polygon-mainnet';
      break;
    case base.id:
      networkName = 'base';
      break;
    default:
      throw new SDKError(
        SDKErrorType.VALIDATION,
        `Unsupported chainId: ${chainId}`,
      );
  }
  return `${baseRpcUrl}?targetName=${networkName}&clientId=${clientId}`;
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
