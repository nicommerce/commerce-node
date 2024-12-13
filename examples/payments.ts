import { CommerceSDK } from '../src/client';
import { PaymentCurrency } from '../src/types/contract';

const COMMERCE_API_KEY = process.env.COMMERCE_API_KEY;
const COMMERCE_API_URL = process.env.COMMERCE_API_URL;
const COMMERCE_RPC_URL = process.env.COMMERCE_RPC_URL;
const COMMERCE_PAYER_WALLET_PRIVATE_KEY =
  process.env.COMMERCE_PAYER_WALLET_PRIVATE_KEY;

// Example USDC configuration for Base network
const USDC_CURRENCY: PaymentCurrency = {
  contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  isNativeAsset: false,
  decimals: 6,
};

const sdk = new CommerceSDK({
  apiKey: COMMERCE_API_KEY as string,
  baseUrl: COMMERCE_API_URL,
  baseRpcUrl: COMMERCE_RPC_URL,
});

/**
 * Create and configure a wallet for payments.
 */
async function setupWallet() {
  if (!COMMERCE_PAYER_WALLET_PRIVATE_KEY) {
    throw new Error('Payer wallet private key not provided');
  }

  return sdk.wallets.createWallet({
    privateKey: `0x${COMMERCE_PAYER_WALLET_PRIVATE_KEY}`,
    chainId: 8453, // Base network
  });
}

/**
 * Create a charge and pay it using the configured wallet.
 */
async function createAndPayCharge(): Promise<void> {
  // Create a new charge
  const { data: newCharge } = await sdk.charges.createCharge({
    pricing_type: 'fixed_price',
    local_price: {
      amount: '0.01',
      currency: 'USD',
    },
  });

  // Hydrate the charge with Web3 data
  const { data: hydratedCharge } = await sdk.charges.hydrateCharge(
    newCharge.data.id,
    {
      sender: '0x89fAbEA34A3A377916EBF7793f37E11EE98D29Fa',
      chain_id: 8453,
    },
  );

  // Setup wallet and pay the charge
  const payerWallet = await setupWallet();
  console.log('Paying with wallet:', payerWallet.account?.address);

  const response = await sdk.charges.payCharge({
    walletClient: payerWallet,
    charge: hydratedCharge.data,
    currency: USDC_CURRENCY,
  });

  console.log('Payment response:', response);
}

// Example usage
async function main() {
  try {
    await createAndPayCharge();
  } catch (error) {
    console.error('Error:', error);
  }
}

if (require.main === module) {
  main();
}
