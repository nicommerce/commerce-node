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
 * Create a new webhook subscription.
 */
async function createWebhook(): Promise<string> {
  const { data: webhook } = await sdk.webhooks.createWebhook({
    url: 'https://example.com/webhooks/coinbase',
  });
  console.log('Created webhook:', JSON.stringify(webhook.data, null, 2));
  return webhook.data.id;
}

/**
 * Get all webhooks for the merchant.
 */
async function getWebhooks(): Promise<void> {
  const { data: webhooks } = await sdk.webhooks.getWebhooks();
  console.log('All webhooks:', JSON.stringify(webhooks, null, 2));
}

// Example usage
async function main() {
  try {
    await createWebhook();
    await getWebhooks();
  } catch (error) {
    console.error('Error:', error);
  }
}

if (require.main === module) {
  main();
}
