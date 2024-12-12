import { CommerceSDK } from '../client';

const COMMERCE_API_KEY = process.env.COMMERCE_API_KEY;
const COMMERCE_API_URL = process.env.COMMERCE_API_URL;

async function test(): Promise<void> {
  const commerce = new CommerceSDK({
    apiKey: COMMERCE_API_KEY as string,
    baseUrl: COMMERCE_API_URL,
  });

  const { data: newCharge } = await commerce.charges.createCharge({
    pricing_type: 'fixed_price',
    local_price: {
      amount: '100.00',
      currency: 'USD',
    },
  });
  console.log('New charge created:');
  console.log(JSON.stringify(newCharge.data, null, 2));

  const { data: hydratedCharge } = await commerce.charges.hydrateCharge(
    newCharge.data.id,
    {
      sender: '0x5770D0616b99E89817A8D9BDe61fddc3A941BdF7',
      chain_id: 1,
    },
  );
  console.log('Charge hydrated:');
  console.log(JSON.stringify(hydratedCharge, null, 2));

  const { data: charge } = await commerce.charges.getCharge(newCharge.data.id);
  console.log('Charge retrieved:');
  console.log(JSON.stringify(charge, null, 2));

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
}

test();
