import { PaymentCurrency } from '../src/types/contract';
import { CommerceSDK } from '../src/client';

const COMMERCE_API_KEY = process.env.COMMERCE_API_KEY;
const COMMERCE_API_URL = process.env.COMMERCE_API_URL;
const COMMERCE_RPC_URL = process.env.COMMERCE_RPC_URL;
const COMMERCE_PAYER_WALLET_PRIVATE_KEY =
  process.env.COMMERCE_PAYER_WALLET_PRIVATE_KEY;
const USDC_CURRENCY: PaymentCurrency = {
  contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  isNativeAsset: false,
  decimals: 6,
};

async function test(): Promise<void> {
  const commerce = new CommerceSDK({
    apiKey: COMMERCE_API_KEY as string,
    baseUrl: COMMERCE_API_URL,
    baseRpcUrl: COMMERCE_RPC_URL,
  });

  const { data: newCharge } = await commerce.charges.createCharge({
    pricing_type: 'fixed_price',
    local_price: {
      amount: '0.01',
      currency: 'USD',
    },
  });
  console.log('New charge created:');
  console.log(JSON.stringify(newCharge.data, null, 2));

  const { data: hydratedCharge } = await commerce.charges.hydrateCharge(
    newCharge.data.id,
    {
      sender: '0x89fAbEA34A3A377916EBF7793f37E11EE98D29Fa',
      chain_id: 8453,
    },
  );
  console.log('Charge hydrated:');
  console.log(JSON.stringify(hydratedCharge, null, 2));

  const { data: charge } = await commerce.charges.getCharge(newCharge.data.id);
  console.log('Charge retrieved:');
  console.log(JSON.stringify(charge, null, 2));

  const { data: charges } = await commerce.charges.getCharges();
  console.log('Charges retrieved:');
  console.log(JSON.stringify(charges, null, 2));

  const { data: checkout } = await commerce.checkouts.createCheckout({
    pricing_type: 'fixed_price',
    local_price: {
      amount: '100.00',
      currency: 'USD',
    },
    name: 'Test Checkout',
    description: 'Test checkout description',
    requested_info: ['email'],
  });
  console.log('Checkout created:');
  console.log(JSON.stringify(checkout, null, 2));

  const { data: retrievedCheckout } = await commerce.checkouts.getCheckout(
    checkout.data.id,
  );
  console.log('Checkout retrieved:');
  console.log(JSON.stringify(retrievedCheckout, null, 2));

  const { data: checkouts } = await commerce.checkouts.getCheckouts();
  console.log('Checkouts retrieved:');
  console.log(JSON.stringify(checkouts, null, 2));

  const { data: newWebhook } = await commerce.webhooks.createWebhook({
    url: 'https://example.com/webhooks/coinbase',
  });
  console.log('New webhook created:');
  console.log(JSON.stringify(newWebhook.data, null, 2));

  const { data: webhook } = await commerce.webhooks.getWebhooks();
  console.log('Webhooks retrieved:');
  console.log(JSON.stringify(webhook, null, 2));
  console.log(JSON.stringify(hydratedCharge.data, null, 2));
  const payerWallet = commerce.wallets.createWallet({
    privateKey: `0x${COMMERCE_PAYER_WALLET_PRIVATE_KEY as string}`,
    chainId: 8453,
  });
  console.log(payerWallet.account?.address);
  const response = await commerce.charges.payCharge({
    walletClient: payerWallet,
    charge: hydratedCharge.data,
    currency: USDC_CURRENCY,
  });
  console.log(response);
}

test();
