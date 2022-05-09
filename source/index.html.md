---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell

toc_footers:
  - Contact <a href="mailto:support@zappistore.com"> support@zappistore.com</a> for API Credentials

includes:
  - errors

search: true

code_clipboard: true
---

# Zappi API

The Zappi API is REST-based and returns responses in JSON.

To use our API, you’ll need to contact us in order to have a public integration created.

# Beta

Please note that as we are still finalizing our API, this spec is subject to change and should not be considered final.

# Change Log

## 9 May 2022

Increased rate limit for numerous endpoints.

## 5 April 2022

Added `workspace_id` optional query parameter to the `GET /products` endpoint.

## 10 January 2022

Added `deliverables_last_updated_at` to the order payload, as part of the metadata object.

## 9 December 2021

Added `customer_hashed_email_address` to the order payload, as part of the metadata object.

## 15 November 2021

Added `visibility` to the `GET order/{id}/deliverables` payload.

## 16 August 2021

Added `visibility` to the order payload.

## 19 July 2021

Added `workspace_id` as an optional parameter on `POST /orders.`
Added `workspace_id` to the order payload.

## 14 July 2021

Added `root_workspace_id` to `GET public_integrations/identity` payload.
Added `GET /workspaces/{id}` endpoint.

## 15 April 2021

Updated `GET /Orders` rate limit from 10 to 20.
Increased default pagination size from 30 to 100.

## 8 April 2021

Added `product_id` and `country_code` to the order payload.

# API Overview

Zappi allows 3rd parties to create public integrations on our platform. This will allow other companies and developers to build integrations which can be installed by different customer groups. All public integrations will need to be reviewed and approved by Zappi. Access tokens for public integrations will expire, and will need to be regenerated when necessary, using the client credentials oAuth flow. In order to make use of a public integration, a customer group will need to install it. Public integrations can be uninstalled at any point in time.

## Public Integrations

In order for a public integration to be made available, the 3rd-party would need to register this public integration on our platform.

Public Integrations will need to be reviewed and approved by Zappi. Once an integration has been approved by Zappi, this integration will be made available to customers on the platform.

### Registration

We will require the following on registration of an Public Integration:


Field | Description | Required
--------- | ----------- | -----------
Integration Name | Any name used to identify the Public Integration | Yes
Author | Company or person who built the integration| Yes
Description | A description of the integration | Yes
Callback URI Host | A list of valid hosts to be used in any callback URIs | No

Each Public Integration will be assigned the following:

Field | Description
--------- | -----------
Client ID | The client identifier to be used for oAuth Client Credentials flow
Client Secret | The client secret to be used for oAuth Client Credentials flow

### Installation

Once a Public Integration is installed on a subdomain, the Public Integration will be able to make API requests on behalf of the customer group.


# Authentication

## oAuth Process


> Example Request:

```shell
curl "http://api.zappi.io/v1/public_integrations/authorize" \
  -H "Authorization: Basic 12345 " \
```

> Example Response:

```json
{
    "access_token": "abcdefghijk",
    "expires_in": 86400,
    "token_type": "Bearer"
}
```

In order to obtain an access token, a request will need to be made to: _POST /public_integrations/authorize_


#### Headers

Field | Description
--------- | -----------
Authorization | Basic `<Base64 encoded(Client ID:Client Secret) >`

#### Response Body

Field | Description | Data Type
--------- | ----------- | -----------
access_token | The access token | The Access Token
expires_in | When the access token expires | DateTime
token_type | This will be `bearer`| String

### Access Token

All requests made by a public integration must have the access token and the installation UUID in the headers, as follows:

_Authorization: Bearer `<access_token>>`_

_X-Zappi-Installation: `<installation_uuid>`_


### Token Expiration

Public Integration access tokens expire after 24 hours.


## Identification

> Example Request:

```shell
curl "http://api.zappi.io/v1/public_integrations" \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456"
```

> Example Response:

```json
{
    "client_id": "123456789",
    "installation_uuid": "123456-789-12345-6789-123456",
    "subdomain_url": "https://subdomain.zappi.io",
    "root_workspace_id": 999
}
```

In order to view information pertaining to a public integration installation, a request will need to be made to: _GET /public_integrations/identity_

#### Response Body

Field | Description | Data Type
--------- | ----------- | -----------
client_id | The Client ID of the public integration | String
installation_uuid | The installation UUID belonging to the customer group/public integration installation | String
root_workspace_id | The ID of the root workspace for this customer group | Integer
subdomain_url | The subdomain URL of the customer group | String

## Permissions

Each integration is assigned a set of permissions. The permissions will determine what actions the integration can perform. Currently all integrations are provided with all the following scopes.

Scope | Label | Description
--------- | ----------- | -----------
read_orders | View orders and order deliverables | View orders belonging to the Customer Group
write_orders | Create orders | Create orders
read_event_subscriptions | View event subscriptions | View event subscriptions
write_event_subscriptions | Create/delete event subscriptions | Subscribe to events
read_workspaces | View workspaces | View workspaces belonging to the Customer and Customer Group

# Rate Limits


Max Requests | Interval (seconds) | Endpoints
--------- | ----------- | -----------
60 | 60 | GET /event_subscriptions
5 | 60 | POST /event_subscriptions
60 | 60 | GET /event_subscriptions/{id}
60 | 60 | DELETE /event_subscriptions/{id}
60 | 60 | GET /orders
60 | 60 | GET /orders/{id}
60 |60 | GET /orders/{id}/delverables
5 | 60 | POST /orders
60 | 60 | GET /products
1 | 300 | POST /public_integrations/authorize
60 | 60 | GET /public_integrations/identity
60 | 60 | GET /workspaces/{id}


# Pagination

Requests that return multiple items will be paginated using cursor pagination.The maximum number of results returned may differ, depending on API traffic.

Field | Description | Required
--------- | ----------- | -----------
limit | The number of results in the response | No
cursor | Identifies where the next set of results should begin. Each API response that contains multiple items will have a `next_cursor` field. | No



# API Endpoints

## Event Subscriptions

### GET /event_subscriptions

> Example Request:

```shell
curl "https://api.zappi.io/v1/event_subscriptions" \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456"
```

> Example Response:

```json
{
    "event_subscriptions": [
        {
            "callback_uri": "https://api.callback_url.com/",
            "event_type": "order_completed",
            "id": 1,
            "order_id": 4
        }
    ],
    "next_cursor": null
}
```

  Returns the list of event subscriptions.

#### Response Body

Field Name | Description | Data Type
--------- | ----------- | -----------
id | Event Subscription ID | Integer
callback_uri | The URI to notify when the event occurs | String
event_type | Type of event subscribed to: `order_completed` | String
order_id | The order ID | String



### GET /event_subscriptions/{id}

> Example Request:

```shell
curl "https://api.zappi.io/v1/event_subscriptions/1" \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456"
```

> Example Response:

```json
{
  "event_subscription": {
    "callback_uri": "https://api.callback_url.com/",
    "event_type": "order_completed",
    "id": 1,
    "order_id": 4
  }
}
```

  Event subscription details

#### Response Body

Field Name | Description | Data Type
--------- | ----------- | -----------
id | Event Subscription ID | Integer
callback_uri | The URI to notify when the event occurs | String
event_type | Type of event subscribed to: `order_completed` | String
order_id | The order ID | String


### POST /event_subscriptions

> Example Request:

```shell
curl "https://api.zappi.io/v1/event_subscriptions" \
  -X POST \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456" \
  -d '{"event_subscription": {"callback_uri":"https://api.callback_url.com/","event_type":"order_completed","order_id": 4}}'
}

```

> Example Response:

```json
{
  "event_subscription": {
    "callback_uri": "https://api.callback_url.com/",
    "event_type": "order_completed",
    "id": 1,
    "order_id": 4
  }
}
```

  Subscribe to an event

#### Request Body

Field Name | Description | Data Type | Required
--------- | ----------- | ----------- | -----------
callback_uri | The URI to notify when the event occurs. This URI needs to be whitelisted beforehand. | String | Yes
event_type | Type of event subscribed to: `order_completed` | Integer | Yes
order_id | The order ID | Integer | Yes

#### Response Body

Field Name | Description | Data Type
--------- | ----------- | -----------
id | Event Subscription ID | Integer
callback_uri | The URI to notify when the event occurs | String
event_type | Type of event subscribed to: `order_completed` | String
order_id | The order ID | String

#### Event Subscription Callback Payload

> Example Event subscription Callback JSON:

```json
{
  "callback_uri": "https://api.callback_url.com/url",
  "event_datetime": "2020-11-25T11:20:00Z",
  "event_reference": "1-1-1",
  "event_type": "order_completed",
  "order_id": 4
}
```

Field Name | Description | Data Type
--------- | ----------- | -----------
callback_uri | The URI to notify when the event occurs | String
event_datetime | The URI to notify when the event occurs. This URI needs to be whitelisted beforehand. | DateTime
event_reference | The unique reference for the event | String
event_type | Type of event subscribed to: `order_completed` | String
order_id | The order ID | String


### DELETE /event_subscriptions/{id}

> Example Request:

```shell
curl "https://api.zappi.io/v1/event_subscriptions/1" \
  -X DELETE \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456"
}

```

  Deletes an event subscription

## Orders

### GET /orders

> Example Request:

```shell
curl "https://api.zappi.io/v1/orders?limit=2&customer_email=name@domain.com" \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456"
```

> Example Response:

```json
{
    "next_cursor": 2,
    "orders": [
        {
            "analyze_url": "https://subdomain.zappi.io/project_setup/zappi-product-test/1/analyze_project",
            "configure_url": "",
            "id": 1,
            "status": "processing",
            "title": "An order title",
            "workspace_id": 1234,
            "visibility": "public",
            "product_id": 4,
            "country_code": "US",
            "metadata": {
              "customer_hashed_email_address": "abcdefghijklmnopq12345",
              "deliverables_last_updated_at": "2021-12-30T11:46:15Z"
            }
        },
        {
            "analyze_url": "https://subdomain.zappi.io/project_setup/zappi-product-test/2/analyze_project",
            "configure_url": "https://subdomain.zappi.io/project_setup/mmr-impackt-lite/2/start_new_project",
            "id": 2,
            "status": "configuration",
            "title": "Another order title",
            "workspace_id": 1234,
            "visibility": "public",
            "product_id": 3,
            "country_code": "GB",
            "metadata": {
              "customer_hashed_email_address": "abcdefghijklmnopq12345",
              "deliverables_last_updated_at": "2021-12-30T11:48:19Z"
            }
        }
    ]
}
```

  Returns the list of orders available to the customer in the customer group

#### Query String

Field Name | Description | Data Type | Required
--------- | ----------- | ----------- | -----------
customer_email | The email address of the customer the request is being made on behalf of. | String | Yes


#### Response Body

Field Name | Description | Data Type
--------- | ----------- | -----------
id | Order Id | Integer
title | Order title | String
product_id | Product ID | Integer
country_code | Fieldwork country’s ISO 3166-1 alpha-2 code | String
status | The status of the order: `configuration`, `processing`, `complete` | String
configure_url | The URL that will go to the configuration page of the order on the Zappi platform | String
analyze_url | The URL that will go to the analysis page of the order on the Zappi platform | String
workspace_id | The workspace ID that the order is in | Integer
visibility | The visibility of the order: `private`, `public` (available to everyone in the organisation | String
metadata | Extra data pertaining to the order | Object

#### Order Metadata

Field Name | Description | Data Type
--------- | ----------- | -----------
customer_hashed_email_address | The SHA 256 hash of the customer email address. Base16 encoded. All lower case | String
deliverables_last_updated_at | The ISO8601 timestamp of the most recent generation of deliverables for the order. | DateTime

For the customer email address "name.surname@domain.com", the hash provided via API would be "b3204d933a7eb98d6f7ed8dbab916a885692a6d78f6f67deb185710c7cd05cee".

### GET /orders/{id}

> Example Request:

```shell
curl "GET https://api.zappi.io/v1/orders/2?customer_email=name@domain.com" \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456"
```

> Example Response:

```json
{
    "order": {
        "analyze_url": "https://subdomain.zappi.io/project_setup/zappi-product-test/2/analyze_project",
        "configure_url": "https://subdomain.zappi.io/project_setup/zappi-product-test/2/start_new_project",
        "id": 2,
        "status": "configuration",
        "title": "Another order title",
        "workspace_id": 1234,
        "visibility": "public",
        "product_id": 4,
        "country_code": "US",
        "metadata": {
          "customer_hashed_email_address": "abcdefghijklmnopq12345",
          "deliverables_last_updated_at": "2021-12-30T11:48:19Z"
        }
    }
}
```

  Returns the list of orders available to the customer in the customer group

#### Query String

Field Name | Description | Data Type | Required
--------- | ----------- | ----------- | -----------
customer_email | The email address of the customer the request is being made on behalf of. | String | Yes


#### Response Body

Field Name | Description | Data Type
--------- | ----------- | -----------
id | Order Id | Integer
analyze_url | The URL that will go to the analysis page of the order on the Zappi platform | String
country_code | Fieldwork country’s ISO 3166-1 alpha-2 code | String
configure_url | The URL that will go to the configuration page of the order on the Zappi platform | String
product_id | Product ID | Integer
status | The status of the order: `configuration`, `processing`, `complete` | String
title | Order title | String
visibility | The visibility of the order: `private`, `public` (available to everyone in the organisation | String
workspace_id | The workspace ID that the order is in | Integer
metadata | Extra data pertaining to the order | Object

### GET /orders/{id}/deliverables

> Example Request:

```shell
curl "https://api.zappi.io/v1/orders/3/deliverables" \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456"
```

> Example Response:

```json
{
    "deliverables": {
        "report": {
            "pdf": "https://s3.amazonaws.com/zappi.api-exports/production/3/report_3.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A123456%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201202T103901Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=123456",
            "xlsx": "https://s3.amazonaws.com/zappi.api-exports/production/3/report_3.xlsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A123456%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201202T103901Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=123456",
            "pptx": "https://s3.amazonaws.com/zappi.api-exports/production/3/report_3.pptx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A123456%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201202T103901Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=123456",
            "visibility": "public"
        },
        "survey_questionnaires": {
            "pdf": [
                "https://s3.amazonaws.com/zappi.api-exports/production/3/3/survey_questionnaire_1_3.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A123456%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201202T103901Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=123456"
            ],
            "visibility": "private"
        },
        "survey_respondent_data": {
            "csv": "https://s3.amazonaws.com/zappi.api-exports/production/3/survey_respondent_data_3.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A123456%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201202T103901Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=123456",
            "sav": "https://s3.amazonaws.com/zappi.api-exports/production/3/survey_respondent_data_3.sav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A123456%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201202T103901Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=123456",
            "visibility": "public"
        },
        "survey_metadata": {
           "xlsx":
"https://s3.amazonaws.com/zappi.api-exports/production/3/survey_metadata_3.xlxs?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A123456%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201202T103901Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=123456",
            "visibility": "public"
    }
}
```

  Returns all the deliverables for the order

#### Response Body

Field Name | Description | Data Type
--------- | ----------- | -----------
deliverables | List of all deliverables available for the order. URLs will expire after a certain period of time. | JSON

#### Deliverables

Export Type | Description | Format | Pre-requisite event
--------- | ----------- | ----------- | -----------
report | The full report with analysis | `.pdf`, `.pptx`, `.xlsx` | `order_complete`
survey_metadata | The survey metadata | `.xls` | `order_complete`
survey_responses | The raw respondent data | `.pdf`, `.pptx` | `order_complete`
survey_questionnaire | The survey questionnaire | `.pdf` | `order_complete`

<aside class="warning">Please note that, for now, the structure and content of our deliverables is subject to change at Zappi’s discretion and should not be regarded as static or permanent. Please keep this in mind when automatically parsing data from these files.</aside>


<br>

### POST /orders

> Example Request:

```shell
curl "https://api.zappi.io/v1/orders" \
  -X POST \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456" \
  -d '{"order":{"product_id":1,"title":"An Order Title", "customer_email":"user@domain.com","workspace_id":1234}'
}

```

> Example Response:

```json
{
    "order": {
        "analyze_url": "https://subdomain.zappi.io/project_setup/zappi-concept-test/4/analyze_project",
        "configure_url": "https://subdomain.zappi.io/project_setup/zappi-concept-test/4/start_new_project",
        "id": 4,
        "status": "configuration",
        "title": "An Order Title",
        "workspace_id": 1,
        "visibility": "public",
        "metadata": {
          "customer_hashed_email_address": "abcdefghijklmnopq12345",
          "deliverables_last_updated_at": "2021-12-30T11:48:19Z"
        }
    }
}
```

  Create an unconfigured order

#### Request Body

Field Name | Description | Data Type | Required
--------- | ----------- | ----------- | -----------
customer_email | Email address of the customer creating the order | String | Yes
product_id | Product ID | Integer | Yes
title | The title of the order | String | Yes
workspace_id | The workspace to create the order under (defaults to the root workspace) | Integer | No

#### Response Body

Field Name | Description | Data Type
--------- | ----------- | -----------
id | Order ID | Integer
analyze_url | The URL that will direct users to the analysis page of the order on the Zappi platform | String
configure_url | The URL that will direct users to the configuration page of the order on the Zappi platform | String
status | The status of the order: `configuration`, `processing`, `complete` | String
title | Order title | String
product_id | Product ID | Integer
country_code | Fieldwork country’s ISO 3166-1 alpha-2 code | String
visibility | The visibility of the order: `private`, `public` (available to everyone in the organisation | String
workspace_id | The workspace ID that the order is in | Integer
metadata | Extra data pertaining to the order | Object

## Products

### GET /products

> Example Request:

```shell
curl "http://api.zappi.io/v1/products?workspace_id=1234" \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456"
```

> Example Response:

```json
{
    "next_cursor": 3,
    "products": [
        {
            "description": "A product description.",
            "id": 2,
            "name": "Product 2"
        },
        {
            "description": "Another product description.",
            "id": 3,
            "name": "Product 3"
        }
    ]
}
```

#### Query String

Field Name | Description | Data Type | Required
--------- | ----------- | ----------- | -----------
workspace_id | The workspace ID to fetch available products for. Defaults to the customer's root workspace. | Integer | No

  Returns the list of products available for the customer group

#### Response Body

Field Name | Description | Data Type
--------- | ----------- | -----------
id | Product ID | Integer
name | Product Name | String
description | Product description | String

## Workspaces

### GET /workspaces/{id}

> Example Request:

```shell
curl "http://api.zappi.io/v1/workspaces/12345" \
  -H "Authorization: Bearer abcdefghijk" \
  -H "X-Zappi-Installation": "123456-789-12345-6789-123456"
```

> Example Response:

```json
{
    "workspace": {
        "children": [
            {
                "children": [],
                "id": 1,
                "label": "worspace 1"
            },
            {
                "children": [],
                "id": 2,
                "label": "workspace 2"
            },
            {
                "children": [],
                "id": 3,
                "label": "workspace 3"
            },
            {
                "children": [
                    {
                        "children": [],
                        "id": 4,
                        "label": "workjspace 4"
                    },
                    {
                        "children": [],
                        "id": 5,
                        "label": "workspace 5"
                    },
                    {
                        "children": [],
                        "id": 6,
                        "label": "workspace 6"
                    },
                    {
                        "children": [],
                        "id": 7,
                        "label": "workspace 7"
                    },
                    {
                        "children": [],
                        "id": 8,
                        "label": "workspace 8"
                    }
                ],
                "id": 9,
                "label": "workspace 9"
            }
        ],
        "id": 12345,
        "label": "root workspace"
    }
}
```

  Workspace details.

#### Query String

Field Name | Description | Data Type | Required
--------- | ----------- | ----------- | -----------
customer_email | The email address of the customer the request is being made on behalf of. | String | Yes

#### Response Body

Field Name | Description | Data Type
--------- | ----------- | -----------
id | Workspace ID | Integer
children | The child workspaces for this workspace | String
label | Workspace title | String

# Event Types

Event Type | Description
--------- | -----------
order_complete | The order is completed. All survey responses have been collected. The report has been generated and is published on the platform. All deliverables have been uploaded to AWS S3.

# Visibility

Visibility Type | Description
--------- | -----------
private | The entity has not been shared with the organisation but may be shared with individual users and user groups.
public | The entity has been shared with the entire organisation.

The visibility is determined by the sharing options assigned on the platform.

# Webhook Security

All requests made by Zappi to the provided callback_uri will have a hash signature with each payload. This hash signature is passed along in the headers as X-Zappi-Signature. The HMAC hexdigest will be used to compute the hash.


