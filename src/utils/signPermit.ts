import { bytesToBigInt } from 'viem';
import { randomBytes } from 'crypto';
import { Permit2SignatureTransferData } from '../types/contract';
import { Address, parseErc6492Signature, WalletClient } from 'viem';
import { SDKError, SDKErrorType } from '../types';
import { getPermit2Address } from './currency';

export const PERMIT2_ADDRESS: Address =
  '0x000000000022D473030F116dDEE9F6B43aC78BA3';

const PERMIT2_TYPES = {
  TokenPermissions: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
  PermitTransferFrom: [
    { name: 'permitted', type: 'TokenPermissions' },
    { name: 'spender', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};

export async function signPermit(params: {
  walletClient: WalletClient;
  chainId: number;
  ownerAddress: Address;
  contractAddress: Address;
  spenderAddress: Address;
  value: bigint;
  deadline: bigint;
}): Promise<Permit2SignatureTransferData> {
  const {
    walletClient,
    chainId,
    ownerAddress,
    contractAddress,
    spenderAddress,
    value,
    deadline,
  } = params;
  const permit2Address = getPermit2Address(chainId);
  if (!permit2Address) {
    throw new SDKError(
      SDKErrorType.VALIDATION,
      'Permit2 contract not found for chain: ${chainId}',
    );
  }
  if (!walletClient.account) {
    throw new SDKError(SDKErrorType.VALIDATION, 'Wallet not connected');
  }
  const nonce = randomBytes(16);
  const message = {
    owner: ownerAddress,
    spender: spenderAddress,
    permitted: {
      token: contractAddress,
      amount: value,
    },
    nonce: bytesToBigInt(nonce),
    deadline,
  };
  const domainData = {
    name: 'Permit2',
    chainId,
    verifyingContract: permit2Address,
  };
  const signature = await walletClient.signTypedData({
    account: walletClient.account,
    message,
    domain: domainData,
    primaryType: 'PermitTransferFrom',
    types: PERMIT2_TYPES,
  });
  const parsedSignature = parseErc6492Signature(signature).signature;
  return {
    permit: {
      permitted: {
        token: contractAddress,
        amount: value,
      },
      spender: spenderAddress,
      nonce: bytesToBigInt(nonce),
      deadline,
    },
    transferDetails: {
      to: spenderAddress,
      requestedAmount: value,
    },
    signature: parsedSignature,
  };
}
