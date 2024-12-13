# commerce-node

The [Coinbase Commerce](https://www.coinbase.com/commerce) Node SDK provides a convenient way to interact with the Coinbase Commerce API.

## Installation

```bash
# Using yarn
yarn add commerce-node

# Using npm
npm install commerce-node
```

## Configuration

Create a new SDK instance with your API credentials:

```typescript
import { CommerceSDK } from 'commerce-node';

const commerce = new CommerceSDK({
  apiKey: 'YOUR_API_KEY', // Required
  baseUrl: 'YOUR_API_URL', // Optional, defaults to https://api.commerce.coinbase.com
});
```

## Usage

### Creating and Hydrating a Charge

```typescript
// Create a new charge
const { data: newCharge } = await commerce.charges.createCharge({
  pricing_type: 'fixed_price',
  local_price: {
    amount: '100.00',
    currency: 'USD',
  },
});

// Hydrate the charge with Web3 data
const { data: hydratedCharge } = await commerce.charges.hydrateCharge(
  newCharge.data.id,
  {
    sender: '0x5770D0616b99E89817A8D9BDe61fddc3A941BdF7',
    chain_id: 1,
  },
);
```

## Error Handling

The SDK throws `SDKError` instances for various error cases:

```typescript
try {
  const { data: charge } = await commerce.charges.createCharge({
    // ... charge details
  });
} catch (error) {
  if (error instanceof SDKError) {
    console.error(`Error type: ${error.type}`);
    console.error(`Message: ${error.message}`);
  }
}
```

Error types include:

- `AUTHENTICATION`: API key issues
- `NETWORK`: Network connectivity problems
- `VALIDATION`: Invalid request parameters
- `RATE_LIMIT`: Too many requests
- `SERVER`: Server-side errors
- `UNKNOWN`: Unexpected errors

## Development

```bash
corepack enable
# Install dependencies
yarn install

# Build the SDK
yarn build

# Run tests
yarn test

# Run integration tests
yarn test:integration
```

## Docs

To generate `SDK` docs:

```bash
yarn run docs
```

## License

MIT

## Documentation

### SKD Docs

[SDK docs](https://nicommerce.github.io/commerce-node/).

### Api Docs

For detailed API documentation, visit the [Coinbase Commerce API Reference](https://docs.cdp.coinbase.com/commerce-onchain/docs/welcome).

## Known Issues

There is a known issue with [viem](https://github.com/wevm/viem/issues/2621).
The temporary workaround is to add the following to your `tsconfig.sjon`

```json
"skipLibCheck": true
```
