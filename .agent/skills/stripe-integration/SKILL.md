---
name: Stripe Integration
description: Skills for Stripe billing, subscriptions, and webhook management
---

# Stripe Integration Skill

## When to Use
- Subscription management
- Payment debugging
- Webhook troubleshooting
- Price/product configuration
- Invoice management

## Key Patterns

### Subscription Lifecycle
1. **Create Product** → `mcp_stripe_create_product`
2. **Create Price** → `mcp_stripe_create_price` (unit_amount in CENTS)
3. **Create Customer** → `mcp_stripe_create_customer`
4. **Payment Link** → `mcp_stripe_create_payment_link`

### Debugging Subscriptions
1. List customer subscriptions: `mcp_stripe_list_subscriptions(customer=<id>)`
2. Check payment intents: `mcp_stripe_list_payment_intents(customer=<id>)`
3. Review invoices: `mcp_stripe_list_invoices(customer=<id>)`

### Webhook Processing
- Webhook route must exist at expected path in the project
- Always verify webhook signature
- Handle these critical events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### Price Formatting
- Stripe uses CENTS: $29.99 → `unit_amount: 2999`
- Currency is lowercase: `"eur"`, `"usd"`
- Always specify currency explicitly

### Common Gotchas
- Tax calculation: use `automatic_tax: { enabled: true }` in Checkout Sessions
- Subscription metadata: store relevant IDs for multi-tenant mapping
- Webhook idempotency: always check if event already processed
- Test mode vs Live mode: use `sk_test_` keys for development

### Environment Variables Required
```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

## Documentation
Use `mcp_stripe_search_stripe_documentation` for specific integration questions.
