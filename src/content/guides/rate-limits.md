---
title: Rate limits
order: 5
examples:
  - title: Rate limited
    lang: json
    status: 429
    code: |
      {
        "code": 1050,
        "message": "Rate limit reached. Please try again later."
      }
---

Each endpoint limits how many requests an installation can make in a window. A request over the limit fails with a `429` and error `1050`. Wait for the window to pass before retrying, and back off if you're rate limited again.

| Endpoint | Max requests | Window |
| --- | --- | --- |
| `POST /public_integrations/authorize` | 1 | 5 minutes |
| `GET /public_integrations/identity` | 60 | 1 minute |
| `POST /orders` | 5 | 1 minute |
| `GET /orders` | 60 | 1 minute |
| `GET /orders/{id}` | 60 | 1 minute |
| `GET /orders/{id}/deliverables` | 60 | 1 minute |
| `GET /products` | 60 | 1 minute |
| `GET /teamspaces` | 60 | 1 minute |
| `POST /event_subscriptions` | 5 | 1 minute |
| `GET /event_subscriptions` | 60 | 1 minute |
| `GET /event_subscriptions/{id}` | 60 | 1 minute |
| `DELETE /event_subscriptions/{id}` | 60 | 1 minute |

:::tip
Access tokens last 24 hours and the authorize endpoint allows one request every 5 minutes, so reuse your token rather than requesting one per call.
:::
