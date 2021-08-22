# Error Codes

The Zappi API uses the following error codes:

Error Code | HTTP Status Code | Error Message
--------- | ----------- | -----------
1000 | 400 | Unable to process the request. Invalid input.
1002 | 400 | Unable to process the request. Invalid request headers.
1010 | 401 | Invalid credentials. Integration does not exist.
1011 | 401 | Access token expired.
1012 | 401 | Access token invalid.
1020 | 403 | Not permitted to access this resource.
1021 | 403 | Request could not be processed.
1030 | 404 | Resource not found.
1031 | 409 | The requested resource already exists.
1050 | 429 | Rate limit reached. Please try again later.
1060 | 500 | Internal server error. Unable to process request.
1061 | 503 | Service unavailable.
