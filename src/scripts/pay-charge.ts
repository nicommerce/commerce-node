import { SDKClient } from '../client.js';

const COMMERCE_API_KEY = process.env.COMMERCE_API_KEY;
const COMMERCE_API_URL = process.env.COMMERCE_API_URL;

async function payAndHydrate() {
  const commerce = new SDKClient({
    apiKey: COMMERCE_API_KEY as string,
    baseUrl: COMMERCE_API_URL,
  });
  const {
    data: { data: newCharge },
  } = await commerce.createCharge.createCharge({
    pricing_type: 'fixed_price',
    local_price: {
      amount: '100.00',
      currency: 'USD',
    },
  });
  const {
    data: { data: hydratedCharge },
  } = await commerce.hydrateCharge.hydrateCharge(newCharge.id, {
    sender: '0x5770D0616b99E89817A8D9BDe61fddc3A941BdF7',
    chain_id: 1,
  });
  console.log(JSON.stringify(hydratedCharge, null, 2));
}

payAndHydrate();
