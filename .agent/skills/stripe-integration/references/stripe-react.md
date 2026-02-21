---
name: stripe-react
description: Official Stripe React integration — Elements provider, PaymentElement, CheckoutProvider, useStripe/useElements hooks. Benchmark 81.7.
source: https://github.com/stripe/react-stripe-js (Official, benchmark 81.7)
---

# Stripe React — Reference

## Setup

```typescript
import { loadStripe } from '@stripe/stripe-js';

// Load OUTSIDE component — never recreate on re-render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
```

## Payment Form (Standard)

```tsx
'use client';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // Validate form
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'Validation failed');
      setLoading(false);
      return;
    }

    // Fetch clientSecret from server
    const res = await fetch('/api/create-payment-intent', { method: 'POST' });
    const { clientSecret } = await res.json();

    // Confirm payment
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
        }}
      />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

// Wrapper with Elements provider
export function CheckoutWrapper({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: 'stripe' },
      }}
    >
      <CheckoutForm />
    </Elements>
  );
}
```

## Server Action (Create PaymentIntent)

```typescript
'use server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPaymentIntent(amount: number, currency = 'eur') {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,       // In cents (e.g., 1099 = €10.99)
    currency,
    automatic_payment_methods: { enabled: true },
  });

  return { clientSecret: paymentIntent.client_secret };
}
```

## Rules

- **`loadStripe`** — call ONCE outside component, pass via prop or module-level const
- **`clientSecret`** — fetch from server, never expose secret key to client
- **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** — only publishable key in `.env`
- **`STRIPE_SECRET_KEY`** — server-only, never in client code
- **`elements.submit()`** — validate BEFORE `confirmPayment` to show errors early
- **`redirect: 'if_required'`** — use for in-page confirmation without redirect
