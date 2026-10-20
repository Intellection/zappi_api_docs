---
title: Authentication
order: 2
examples:
  - title: Authenticated request
    lang: bash
    code: |
      curl https://api.zappi.io/v1/public_integrations/identity \
        -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
        -H "X-Zappi-Installation: YOUR_INSTALLATION_UUID"
---

The API uses the OAuth 2.0 client credentials flow.

1. [Exchange your client ID and secret](#public-integrations-authorize) for an access token.
2. Send the token, and the UUID of the installation you're acting for, on every other request.

| Header | Value |
| --- | --- |
| `Authorization` | `Bearer <access_token>` |
| `X-Zappi-Installation` | `<installation_uuid>` |

A request without these headers fails with error `1001`. An invalid token fails with `1012`, and an unknown installation with `1010`. See [Errors](#errors).

:::warning
Your client secret and access tokens grant access to your customers' data. Keep them on your server and never expose them in client-side code.
:::

### Token expiry

Access tokens last for the number of seconds given in `expires_in`, currently 24 hours. Reuse a token until it expires, then request a new one. A request with an expired token fails with error `1011`.

### Scopes

Each integration is granted a set of scopes, which decide the endpoints it can call. A request to an endpoint your integration doesn't have the scope for fails with error `1020`. The scope each endpoint needs is shown in its reference.

| Scope | Allows |
| --- | --- |
| `read_orders` | Viewing orders and their deliverables |
| `write_orders` | Creating orders |
| `read_products` | Viewing products |
| `read_teamspaces` | Viewing teamspaces |
| `read_event_subscriptions` | Viewing event subscriptions |
| `write_event_subscriptions` | Creating and deleting event subscriptions |
