---
title: Webhook security
examples:
  - title: Verify a signature (Node.js)
    lang: javascript
    code: |
      import { createHmac, timingSafeEqual } from "node:crypto";

      // rawBody is the request body exactly as received, before parsing
      function isFromZappi(rawBody, signature, clientSecret) {
        const expected = createHmac("sha256", clientSecret)
          .update(rawBody)
          .digest("hex");

        const received = Buffer.from(signature.toLowerCase());
        return (
          received.length === expected.length &&
          timingSafeEqual(Buffer.from(expected), received)
        );
      }
---

Zappi signs every event it sends so you can check it came from us. The signature is in the `X-Zappi-Signature` header.

To verify an event:

1. Compute an HMAC-SHA256 of the raw request body, using your integration's client secret as the key.
2. Hex encode the result.
3. Compare it with the `X-Zappi-Signature` header. The header is upper case hex, so compare case-insensitively.

:::warning
Sign the body exactly as you received it. Parsing and re-serialising the JSON can change it and break the signature.
:::

Use a constant-time comparison, such as `timingSafeEqual`, so that attackers can't learn the signature from response times.
