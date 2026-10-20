---
title: Event types
examples:
  - title: Event payload
    lang: json
    code: |
      {
        "callback_uri": "https://example.com/zappi/webhooks",
        "event_datetime": "2026-03-29T11:20:00Z",
        "event_reference": "1-12-34",
        "event_type": "order_completed",
        "order_id": 4
      }
---

When a subscribed event happens, Zappi sends a `POST` request with a JSON payload to the subscription's `callback_uri`.

| Event type | Sent when |
| --- | --- |
| `order_completed` | The order is complete: all survey responses are collected, the report is published on the platform, and all [deliverables](#orders-deliverables) are ready to download. |

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `callback_uri` | string | The URI the event was sent to |
| `event_datetime` | datetime | When the event happened, in ISO 8601 format (UTC) |
| `event_reference` | string | A unique reference for this event |
| `event_type` | string | The type of event |
| `order_id` | integer | The order the event is about |

### Responding to events

Respond with a `200` status to acknowledge an event. Zappi treats any other status, including `201` and `204`, as a failure and retries up to twice more.
