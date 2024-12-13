# Commerce SDK Examples

Simple examples demonstrating how to use the Commerce SDK.

## Setup

1. Create a `.env` file:

```bash
COMMERCE_API_KEY=your_api_key
COMMERCE_API_URL=https://api.commerce.coinbase.com
COMMERCE_RPC_URL=your_rpc_url
COMMERCE_PAYER_WALLET_PRIVATE_KEY=your_private_key  # Only needed for payment examples
```

2. Install dependencies:

```bash
yarn install
```

## Examples

### Charges

```bash
yarn ts-node examples/charges.ts
```

Demonstrates creating, retrieving, and hydrating charges.

### Checkouts

```bash
yarn ts-node examples/checkouts.ts
```

Shows how to create and manage checkouts.

### Webhooks

```bash
yarn ts-node examples/webhooks.ts
```

Examples of webhook subscription management.

### Payments

```bash
yarn ts-node examples/payments.ts
```

Complete example of creating and paying a charge with a Web3 wallet.
