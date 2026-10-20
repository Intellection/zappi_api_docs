---
title: Errors
order: 3
examples:
  - title: Error response
    lang: json
    status: 401
    code: |
      {
        "code": 1011,
        "message": "Access token expired."
      }
  - title: Validation error
    lang: json
    status: 400
    code: |
      {
        "error": {
          "path": "#",
          "message": "Required property customer_email was not present."
        }
      }
---

The API uses HTTP status codes to show whether a request succeeded. Codes in the `2xx` range mean success, `4xx` codes mean the request failed because of the information sent, and `5xx` codes mean something went wrong at Zappi.

Error responses include a numeric `code` and a `message`. The message may end with more detail about what went wrong.

| Code | HTTP status | Message |
| --- | --- | --- |
| `1000` | 400 | Invalid input. Unable to process the request. |
| `1001` | 400 | Invalid request headers. Unable to process the request. |
| `1010` | 401 | Invalid credentials. Integration does not exist. |
| `1011` | 401 | Access token expired. |
| `1012` | 401 | Access token invalid. |
| `1020` | 401 | Not permitted to access this resource. |
| `1021` | 403 | Request could not be processed. |
| `1030` | 404 | Resource not found. |
| `1050` | 429 | Rate limit reached. Please try again later. |
| `1060` | 500 | Internal server error. Unable to process request. |

:::note
Requests are checked against the API's schema before anything else. A request with a missing required parameter or a value of the wrong type gets a `400` with an `error` object instead, as in the validation error example.
:::
