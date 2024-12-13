import { CommerceSDK } from '../src/client';

const COMMERCE_API_KEY = process.env.COMMERCE_API_KEY;
const COMMERCE_API_URL = process.env.COMMERCE_API_URL;
const COMMERCE_RPC_URL = process.env.COMMERCE_RPC_URL;

const sdk = new CommerceSDK({
  apiKey: COMMERCE_API_KEY as string,
  baseUrl: COMMERCE_API_URL,
  baseRpcUrl: COMMERCE_RPC_URL,
});

/**
 * Create a new charge.
 */
async function createCharge(): Promise<string> {
  const { data: newCharge } = await sdk.charges.createCharge({
    pricing_type: 'fixed_price',
    local_price: {
      amount: '0.01',
      currency: 'USD',
    },
  });
  return newCharge.data.id;
}

/**
 * Hydrate a charge with Web3 data.
 */
async function hydrateCharge(chargeId: string): Promise<void> {
  const { data: hydratedCharge } = await sdk.charges.hydrateCharge(chargeId, {
    sender: '0x89fAbEA34A3A377916EBF7793f37E11EE98D29Fa',
    chain_id: 8453,
  });
  console.log('Hydrated charge:', JSON.stringify(hydratedCharge, null, 2));
}

/**
 * Get a charge by ID.
 */
async function getCharge(chargeId: string): Promise<void> {
  const { data: charge } = await sdk.charges.getCharge(chargeId);
  console.log('Retrieved charge:', JSON.stringify(charge, null, 2));
}

/**
 * List all charges.
 */
async function listCharges(): Promise<void> {
  const { data: charges } = await sdk.charges.getCharges();
  console.log('All charges:', JSON.stringify(charges, null, 2));
}

// Example usage
async function main() {
  try {
    const chargeId = await createCharge();
    await hydrateCharge(chargeId);
    await getCharge(chargeId);
    await listCharges();
  } catch (error) {
    console.error('Error:', error);
  }
}

if (require.main === module) {
  main();
}
