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
 * Create a new checkout.
 */
async function createCheckout(): Promise<string> {
  const { data: checkout } = await sdk.checkouts.createCheckout({
    pricing_type: 'fixed_price',
    local_price: {
      amount: '100.00',
      currency: 'USD',
    },
    name: 'Test Checkout',
    description: 'Test checkout description',
    requested_info: ['email'],
  });
  return checkout.data.id;
}

/**
 * Get a checkout by ID.
 */
async function getCheckout(checkoutId: string): Promise<void> {
  const { data: checkout } = await sdk.checkouts.getCheckout(checkoutId);
  console.log('Retrieved checkout:', JSON.stringify(checkout, null, 2));
}

/**
 * List all checkouts.
 */
async function listCheckouts(): Promise<void> {
  const { data: checkouts } = await sdk.checkouts.getCheckouts();
  console.log('All checkouts:', JSON.stringify(checkouts, null, 2));
}

// Example usage
async function main() {
  try {
    const checkoutId = await createCheckout();
    await getCheckout(checkoutId);
    await listCheckouts();
  } catch (error) {
    console.error('Error:', error);
  }
}

if (require.main === module) {
  main();
}
