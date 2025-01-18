# Crypto Master

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing Stripe Integration

### Prerequisites

1. A Stripe account (create one at [stripe.com](https://stripe.com))
2. The Stripe CLI installed ([installation guide](https://stripe.com/docs/stripe-cli))

### Setup

1. Login to your Stripe account in the CLI:

```bash
stripe login
```

2. Start the webhook listener:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. Copy the webhook signing secret shown in the CLI and add it to your `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Testing Webhooks

In a new terminal, you can trigger test events:

```bash
# Test successful subscription
stripe trigger checkout.session.completed

# Test subscription cancellation
stripe trigger customer.subscription.deleted
```

### Test Cards

Use these cards in test mode:

- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0000 0000 3220

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).
