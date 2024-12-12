import { Address } from './contract';

export type CreateWalletParams = {
  privateKey?: Address;
  secretWords?: string;
  chainId: number;
};
