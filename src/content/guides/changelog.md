---
title: Changelog
order: 7
---

#### 30 July 2026

- Added `teamspace_uuid` to the order payload.
- Added `teamspace_uuid` as an optional query parameter on `GET /orders`.

#### 21 July 2026

- Added the `GET /teamspaces` endpoint.
- Removed the `GET /workspaces/{id}` endpoint.
- Removed `workspace_id` from the order and product endpoints.
- Removed `root_workspace_id` from the `GET /public_integrations/identity` payload.

#### 4 August 2022

- Added `delivered_at` to the order's `metadata`.

#### 9 May 2022

- Increased the rate limit for several endpoints.

#### 5 April 2022

- Added the optional `workspace_id` query parameter to `GET /products`.

#### 10 January 2022

- Added `deliverables_last_updated_at` to the order's `metadata`.

#### 9 December 2021

- Added `customer_hashed_email_address` to the order's `metadata`.

#### 15 November 2021

- Added `visibility` to the `GET /orders/{id}/deliverables` payload.

#### 16 August 2021

- Added `visibility` to the order payload.

#### 19 July 2021

- Added `workspace_id` as an optional parameter on `POST /orders`.
- Added `workspace_id` to the order payload.

#### 14 July 2021

- Added `root_workspace_id` to the `GET /public_integrations/identity` payload.
- Added the `GET /workspaces/{id}` endpoint.

#### 15 April 2021

- Raised the `GET /orders` rate limit from 10 to 20 requests.
- Increased the default page size from 30 to 100.

#### 8 April 2021

- Added `product_id` and `country_code` to the order payload.
