---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell
  - ruby
  - python
  - javascript

toc_footers:
  - <a href='#'>Sign Up for a Developer Key</a>
  - <a href='https://github.com/slatedocs/slate'>Documentation Powered by Slate</a>

includes:
  - errors

search: true

code_clipboard: true
---

# Zappi API

The Zappi API is REST-based and returns responses in JSON.

To use our API, you’ll need to contact us in order to have a public integration set up.

# Beta

Please note that as we are still finalizing our API, this spec is subject to change and should not be considered final.

# Change Log

## 16 August 2021

Added ‘visibility’ to the order payload.

## 19 July 2021

Added ‘workspace_id’ as an optional parameter on POST /orders.
Added ‘workspace_id’ to the order payload.

## 14 July 2021

Added ‘root_workspace_id’ to GET public_integrations/identity payload.
Added GET /workspaces/{id} endpoint.

## 15 April 2021

Updated GET /Orders rate limit from 10 to 20.
Increased default pagination size from 30 to 100.

## 8 April 2021

Added product_id and country_code to the order payload.

# API Overview

Zappi allows 3rd parties to create public integrations on our platform. This will allow other companies and developers to build integrations which can be installed by different customer groups. All public integrations will need to be reviewed and approved by Zappi. Access tokens for public integrations will expire, and will need to be regenerated when necessary, using the client credentials oAuth flow. In order to make use of a public integration, a customer group will need to install it. Public integrations can be uninstalled at any point in time.
Public Integrations
In order for a public integration to be made available, the 3rd-party would need to register this public integration on our platform.

Public Integrations will need to be reviewed and approved by Zappi. Once an integration has been approved by Zappi, this integration will be made available to customers on the platform.

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
Redirect URL | The URL Zappi will redirect users to after installation | Yes
Callback URI Host | A list of valid hosts to be used in any callback URIs | No

Each Public Integration will be assigned the following:

Field | Description
--------- | -----------
Client ID | The client identifier to be used for oAuth Client Credentials flow
Client Secret | The client secret to be used for oAuth Client Credentials flow

### Installation

When a Public Integration is installed on a subdomain, Zappi will redirect the user to the provided Redirect URL with the installation_uuid and the client_id in the query string.


# Authentication

## oAuth Process

In order to obtain an access token, a request will need to be made to: _POST /public_integrations/authorize_


### Headers

Field | Description
--------- | -----------
Authorization | Basic `<Base64 encoded(Client ID:Client Secret) >`

### Response Body

Field | Description | Data Type
--------- | ----------- | -----------
access_token | The access token | The Access Token
token_type | This will be `bearer``| String
expires_in | When the access token expires | DateTime

### Access Token

All requests made by a public integration must have the access token and the installation UUID in the headers, as follows:

_Authorization: Bearer `<access_token>>`_

_X-Zappi-Installation: `<installation_uuid>`_


### Token Expiration

Public Integration access tokens expire after 24 hours.


## Identification

In order to view information pertaining to a public integration installation, a request will need to be made to: _GET /public_integrations/identity_

### Response Body

Field | Description | Data Type
--------- | ----------- | -----------
client_id | The Client ID of the public integration | String
subdomain_url | The subdomain URL of the customer group | String
installation_uuid | The installation UUID belonging to the customer group/public integration installation | String
root_workspace_id | The ID of the root workspace for this customer group | Integer

## Permissions

Each integration is assigned a set of permissions. The permissions will determine what actions the integration can perform. Currently all integrations are provided with all the following scopes.

Scope | Label | Description
--------- | ----------- | -----------
read_orders | View orders and order deliverables | View orders belonging to the Customer Group.
write_orders | Create orders | Create orders
write_event_subscriptions | Create/delete event subscriptions | Subscribe to events
read_event_subscriptions | View event subscriptions | View event subscriptions
read_workspaces | View workspaces | View workspaces belonging to the Customer and Customer Group


# Rate Limits


Max Requests | Interval (seconds) | Endpoints
--------- | ----------- | -----------
20 | 60 | GET orders/
10 | 60 | GET orders/{id}
10 |60 | GET orders/{id}/delverables
5 | 60 | POST orders/
10 | 60 | GET products/
10 | 60 | GET public_integrations/identity/
1 | 300 | POST public_integrations/authorize
10 | 60 | GET event_subscriptions/
5 | 60 | View POST event_subscriptions
10 | 60 | GET event_subscriptions/{id}
10 | 60 | DELETE event_subscriptions/{id}
10 | 60 | GET workspaces/{id}


# Pagination

Requests that return multiple items will be paginated using cursor pagination.The maximum number of results returned may differ, depending on API traffic.

Field | Description | Required
--------- | ----------- | -----------
limit | The number of results in the response | No
cursor | Identifies where the next set of results should begin. Each API response that contains multiple items will have a `next_cursor` field. | No



# API Endpoints

## Products

- GET /products
- Returns the list of products available for the customer group

### Response

Field Name | Description | Data Type
--------- | ----------- | -----------
id | Product ID | Integer
name | Product Name | String
description | Product description | String


## Orders

- GET /orders
- Returns the list of orders available to the customer in the customer group

### Query String

Field Name | Description | Data Type | Required
--------- | ----------- | ----------- | -----------
customer_email | The email address of the customer the request is being made on behalf of. | String | Yes


### Response

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


> To authorize, use this code:

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
```

```shell
# With shell, you can just pass the correct header with each request
curl "api_endpoint_here" \
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require('kittn');

let api = kittn.authorize('meowmeowmeow');
```

> Make sure to replace `meowmeowmeow` with your API key.

Kittn uses API keys to allow access to the API. You can register a new Kittn API key at our [developer portal](http://example.com/developers).

Kittn expects for the API key to be included in all API requests to the server in a header that looks like the following:

`Authorization: meowmeowmeow`

<aside class="notice">
You must replace <code>meowmeowmeow</code> with your personal API key.
</aside>

# Kittens

## Get All Kittens

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.get
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.get()
```

```shell
curl "http://example.com/api/kittens" \
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require('kittn');

let api = kittn.authorize('meowmeowmeow');
let kittens = api.kittens.get();
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": 1,
    "name": "Fluffums",
    "breed": "calico",
    "fluffiness": 6,
    "cuteness": 7
  },
  {
    "id": 2,
    "name": "Max",
    "breed": "unknown",
    "fluffiness": 5,
    "cuteness": 10
  }
]
```

This endpoint retrieves all kittens.

### HTTP Request

`GET http://example.com/api/kittens`

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
include_cats | false | If set to true, the result will also include cats.
available | true | If set to false, the result will include kittens that have already been adopted.

<aside class="success">
Remember — a happy kitten is an authenticated kitten!
</aside>

## Get a Specific Kitten

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.get(2)
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.get(2)
```

```shell
curl "http://example.com/api/kittens/2" \
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require('kittn');

let api = kittn.authorize('meowmeowmeow');
let max = api.kittens.get(2);
```

> The above command returns JSON structured like this:

```json
{
  "id": 2,
  "name": "Max",
  "breed": "unknown",
  "fluffiness": 5,
  "cuteness": 10
}
```

This endpoint retrieves a specific kitten.

<aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside>

### HTTP Request

`GET http://example.com/kittens/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the kitten to retrieve

## Delete a Specific Kitten

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.delete(2)
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.delete(2)
```

```shell
curl "http://example.com/api/kittens/2" \
  -X DELETE \
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require('kittn');

let api = kittn.authorize('meowmeowmeow');
let max = api.kittens.delete(2);
```

> The above command returns JSON structured like this:

```json
{
  "id": 2,
  "deleted" : ":("
}
```

This endpoint deletes a specific kitten.

### HTTP Request

`DELETE http://example.com/kittens/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the kitten to delete

