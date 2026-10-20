---
title: Zappi API
navLabel: Introduction
order: 1
examples:
  - title: Base URL
    lang: bash
    code: https://api.zappi.io/v1
---

The Zappi API is organised around REST. It has predictable, resource-oriented URLs, accepts JSON request bodies, returns JSON responses, and uses standard HTTP status codes and verbs.

With it, a public integration can create orders on behalf of a customer, follow them through to completion and download their deliverables.

:::note
The API is in beta. We may still change it, so don't treat this reference as final.
:::

### Public integrations

Third parties connect to Zappi through a **public integration**. Zappi reviews and approves every integration before customers can use it.

To register one, contact [support@zappistore.com](mailto:support@zappistore.com) with:

| Field | Description | Required |
| --- | --- | --- |
| Integration name | A name that identifies the integration | Yes |
| Author | The company or person who built the integration | Yes |
| Description | What the integration does | Yes |
| Callback URI hosts | The hosts your [webhooks](#webhooks) may call | No |

We'll give you a **client ID** and **client secret**, which you exchange for [access tokens](#authentication).

### Installations

A customer group installs your integration on its Zappi subdomain, and can uninstall it at any time. Each installation has its own UUID. Your integration acts on behalf of the customer group that installed it, so send the installation UUID with every request.
