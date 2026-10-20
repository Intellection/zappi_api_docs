---
title: Pagination
order: 4
examples:
  - title: Next page
    lang: bash
    code: |
      curl -G https://api.zappi.io/v1/orders \
        -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
        -H "X-Zappi-Installation: YOUR_INSTALLATION_UUID" \
        --data-urlencode "customer_email=name@domain.com" \
        -d limit=20 \
        -d cursor=5
---

Endpoints that list objects return them a page at a time, using cursor pagination.

| Parameter | Description |
| --- | --- |
| `limit` | The number of results to return. Defaults to 100. |
| `cursor` | Where the next page starts. Pass the `next_cursor` from the previous response. |

Each list response includes a `next_cursor`. To fetch the next page, repeat the request with `cursor` set to that value. When `next_cursor` is `null`, you've reached the last page.

The number of results returned may vary with API traffic, so don't assume a page is full.
