// The API reference, grouped by domain. Keep this in step with the request
// contract in zappi-api's documentation/api_reference.json.

import type { Domain, Field } from "./types";

const PER_MINUTE = (n: number) => `${n} requests per minute`;

const customerEmail: Field = {
  name: "customer_email",
  type: "string",
  required: true,
  description: "Email address of the customer the request is made on behalf of.",
};

const pagination: Field[] = [
  {
    name: "limit",
    type: "integer",
    description: "The number of results to return. Defaults to 100. See [Pagination](#pagination).",
  },
  {
    name: "cursor",
    type: "string",
    description: "The `next_cursor` from the previous page. See [Pagination](#pagination).",
  },
];

const orderMetadata: Field[] = [
  {
    name: "customer_hashed_email_address",
    type: "string",
    description:
      "SHA-256 hash of the customer's email address, hex encoded in lower case. For `name.surname@domain.com` it is `b3204d933a7eb98d6f7ed8dbab916a885692a6d78f6f67deb185710c7cd05cee`.",
  },
  {
    name: "deliverables_last_updated_at",
    type: "datetime | null",
    description: "ISO 8601 timestamp of the most recent generation of the order's deliverables.",
  },
  {
    name: "delivered_at",
    type: "datetime | null",
    description: "ISO 8601 timestamp of delivery: when fieldwork completed and the study closed.",
  },
];

const orderAttributes: Field[] = [
  { name: "id", type: "integer", description: "Unique identifier for the order." },
  { name: "title", type: "string", description: "The order's title." },
  {
    name: "status",
    type: "string",
    description: "Where the order is in its lifecycle.",
    values: ["configuration", "processing", "complete"],
  },
  { name: "product_id", type: "integer", description: "The [product](#products-object) the order is for." },
  { name: "country_code", type: "string", description: "The fieldwork country's ISO 3166-1 alpha-2 code." },
  {
    name: "teamspace_uuid",
    type: "string | null",
    description: "The [teamspace](#teamspaces-object) the order belongs to, or `null` if it belongs to none.",
  },
  {
    name: "visibility",
    type: "string",
    description: "Who can see the order. See [Visibility](#visibility).",
    values: ["private", "public"],
  },
  {
    name: "configure_url",
    type: "string",
    description: "Link to the order's configuration page on the Zappi platform.",
  },
  { name: "analyze_url", type: "string", description: "Link to the order's analysis page on the Zappi platform." },
  { name: "metadata", type: "object", description: "Extra data about the order.", children: orderMetadata },
];

const order = {
  id: 2,
  title: "Spring campaign concept test",
  status: "complete",
  product_id: 4,
  country_code: "US",
  teamspace_uuid: "3f2a9c1e-7b84-4d16-9c33-0a1e5d6f8b20",
  visibility: "public",
  configure_url: "https://subdomain.zappi.io/project_setup/zappi-concept-test/2/start_new_project",
  analyze_url: "https://subdomain.zappi.io/project_setup/zappi-concept-test/2/analyze_project",
  metadata: {
    customer_hashed_email_address: "b3204d933a7eb98d6f7ed8dbab916a885692a6d78f6f67deb185710c7cd05cee",
    deliverables_last_updated_at: "2026-03-30T11:46:15Z",
    delivered_at: "2026-03-29T00:00:00Z",
  },
};

const newOrder = {
  ...order,
  id: 4,
  title: "Summer campaign concept test",
  status: "configuration",
  configure_url: "https://subdomain.zappi.io/project_setup/zappi-concept-test/4/start_new_project",
  analyze_url: "https://subdomain.zappi.io/project_setup/zappi-concept-test/4/analyze_project",
  metadata: { ...order.metadata, deliverables_last_updated_at: null, delivered_at: null },
};

const s3 = (key: string) =>
  `https://s3.amazonaws.com/zappi.api-exports/production/2/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Signature=...`;

const product = { id: 2, name: "Zappi Concept Test", description: "Test early-stage concepts with consumers." };

const teamspace = { uuid: "3f2a9c1e-7b84-4d16-9c33-0a1e5d6f8b20", name: "Marketing", private: false };

const eventSubscription = {
  id: 1,
  event_type: "order_completed",
  callback_uri: "https://example.com/zappi/webhooks",
  order_id: 4,
};

const eventSubscriptionAttributes: Field[] = [
  { name: "id", type: "integer", description: "Unique identifier for the subscription." },
  {
    name: "event_type",
    type: "string",
    description: "The event to be notified about. See [Event types](#event-types).",
    values: ["order_completed"],
  },
  { name: "callback_uri", type: "string", description: "The URI Zappi sends the event to." },
  { name: "order_id", type: "integer", description: "The order the subscription watches." },
];

const visibilityField: Field = {
  name: "visibility",
  type: "string | null",
  description: "Who can see this deliverable. See [Visibility](#visibility).",
};

export const domains: Domain[] = [
  {
    id: "access-tokens",
    label: "Access tokens",
    description: "Exchange your client credentials for an access token, and look up the installation a token is for.",
    sections: [
      {
        kind: "endpoint",
        id: "public-integrations-authorize",
        title: "Get an access token",
        method: "POST",
        path: "/public_integrations/authorize",
        description:
          "Exchanges your client ID and secret for an access token, using HTTP Basic authentication. Send the token as a Bearer token on every other request. See [Authentication](#authentication).",
        rateLimit: "1 request per 5 minutes",
        returns:
          "An access token, its type and its lifetime in seconds. Request a new token when it expires; until then, reuse it.",
        request: { method: "POST", path: "/public_integrations/authorize", auth: "basic" },
        response: {
          status: 200,
          body: { access_token: "eyJraWQiOiJ...", token_type: "Bearer", expires_in: 86400 },
        },
      },
      {
        kind: "endpoint",
        id: "public-integrations-identity",
        title: "Retrieve the installation",
        method: "GET",
        path: "/public_integrations/identity",
        description: "Returns details of the installation the request is made for.",
        rateLimit: PER_MINUTE(60),
        returns:
          "Your integration's `client_id`, the `installation_uuid`, and the `subdomain_url` of the customer group that installed it.",
        request: { method: "GET", path: "/public_integrations/identity" },
        response: {
          status: 200,
          body: {
            client_id: "4b8hv3k2l9q1mn7c5s6d0f2g8a",
            installation_uuid: "d7c1e2a4-5b6f-4c3d-8e9a-0b1c2d3e4f5a",
            subdomain_url: "https://subdomain.zappi.io",
          },
        },
      },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    description: "An order is a research study a customer runs on the Zappi platform.",
    sections: [
      {
        kind: "object",
        id: "orders-object",
        title: "The Order object",
        description: "An order is a research study for a product, owned by a customer in the customer group.",
        attributes: orderAttributes,
        example: order,
      },
      {
        kind: "endpoint",
        id: "orders-create",
        title: "Create an order",
        method: "POST",
        path: "/orders",
        description:
          "Creates an unconfigured order for a customer. The customer finishes setting it up on the Zappi platform at `configure_url`.",
        scope: "write_orders",
        rateLimit: PER_MINUTE(5),
        bodyWrapper: "order",
        bodyParams: [
          { name: "product_id", type: "integer", required: true, description: "The [product](#products-list) to order." },
          { name: "title", type: "string", required: true, description: "A title for the order." },
          {
            name: "customer_email",
            type: "string",
            required: true,
            description: "Email address of the customer the order is created for.",
          },
        ],
        returns: "The new [Order object](#orders-object), with a `201` status.",
        request: {
          method: "POST",
          path: "/orders",
          body: {
            order: { product_id: 4, title: "Summer campaign concept test", customer_email: "name@domain.com" },
          },
        },
        response: { status: 201, body: { order: newOrder } },
      },
      {
        kind: "endpoint",
        id: "orders-list",
        title: "List orders",
        method: "GET",
        path: "/orders",
        description: "Returns the orders the customer can see in the customer group.",
        scope: "read_orders",
        rateLimit: PER_MINUTE(60),
        queryParams: [
          customerEmail,
          {
            name: "teamspace_uuid",
            type: "string",
            description:
              "Return only orders in this [teamspace](#teamspaces-list). Responds with a `404` if the teamspace doesn't exist or the customer isn't a member of it.",
          },
          ...pagination,
        ],
        returns: "A page of [Order objects](#orders-object) and the `next_cursor` for the following page.",
        request: { method: "GET", path: "/orders", query: { customer_email: "name@domain.com", limit: "2" } },
        response: {
          status: 200,
          body: { orders: [order, newOrder], next_cursor: 5 },
        },
      },
      {
        kind: "endpoint",
        id: "orders-retrieve",
        title: "Retrieve an order",
        method: "GET",
        path: "/orders/{id}",
        description: "Returns a single order.",
        scope: "read_orders",
        rateLimit: PER_MINUTE(60),
        pathParams: [{ name: "id", type: "integer", required: true, description: "The order's ID." }],
        queryParams: [customerEmail],
        returns: "An [Order object](#orders-object). Responds with a `404` if the order doesn't exist.",
        request: { method: "GET", path: "/orders/2", query: { customer_email: "name@domain.com" } },
        response: { status: 200, body: { order } },
      },
      {
        kind: "endpoint",
        id: "orders-deliverables",
        title: "Retrieve an order's deliverables",
        method: "GET",
        path: "/orders/{id}/deliverables",
        description:
          "Returns download links for an order's deliverables. They're ready once the [`order_completed`](#event-types) event fires; before then `deliverables` is an empty object.",
        scope: "read_orders",
        rateLimit: PER_MINUTE(60),
        callouts: [
          {
            type: "note",
            text: "Download links are pre-signed and expire after an hour. Fetch fresh links rather than storing them.",
          },
          {
            type: "warning",
            text: "The structure and content of deliverable files may change at Zappi's discretion. Bear this in mind if you parse them automatically.",
          },
        ],
        pathParams: [{ name: "id", type: "integer", required: true, description: "The order's ID." }],
        returns:
          "A `deliverables` object. Each deliverable has a `visibility` and a link for every format available; formats that don't exist for the order are left out.",
        responseFields: [
          {
            name: "report",
            type: "object",
            description: "The full report with analysis.",
            children: [
              { name: "pdf", type: "string", description: "Link to the PDF report." },
              { name: "pptx", type: "string", description: "Link to the PowerPoint report." },
              { name: "xlsx", type: "string", description: "Link to the Excel report." },
              visibilityField,
            ],
          },
          {
            name: "survey_questionnaires",
            type: "object",
            description: "The survey questionnaires.",
            children: [
              { name: "pdf", type: "string[]", description: "Links to each questionnaire as a PDF." },
              visibilityField,
            ],
          },
          {
            name: "survey_respondent_data",
            type: "object",
            description: "The raw respondent data.",
            children: [
              { name: "csv", type: "string", description: "Link to the data as CSV." },
              { name: "sav", type: "string", description: "Link to the data as an SPSS file." },
              visibilityField,
            ],
          },
          {
            name: "survey_metadata",
            type: "object",
            description: "The survey metadata.",
            children: [{ name: "xlsx", type: "string", description: "Link to the metadata as Excel." }, visibilityField],
          },
        ],
        request: { method: "GET", path: "/orders/2/deliverables" },
        response: {
          status: 200,
          body: {
            deliverables: {
              report: {
                pdf: s3("report_2.pdf"),
                pptx: s3("report_2.pptx"),
                xlsx: s3("report_2.xlsx"),
                visibility: "public",
              },
              survey_questionnaires: { pdf: [s3("survey_questionnaire_1_2.pdf")], visibility: "private" },
              survey_respondent_data: {
                csv: s3("survey_respondent_data_2.csv"),
                sav: s3("survey_respondent_data_2.sav"),
                visibility: "public",
              },
              survey_metadata: { xlsx: s3("survey_metadata_2.xlsx"), visibility: "public" },
            },
          },
        },
      },
    ],
  },
  {
    id: "products",
    label: "Products",
    description: "The Zappi products a customer group can order.",
    sections: [
      {
        kind: "object",
        id: "products-object",
        title: "The Product object",
        description: "A product is a type of research study, such as a concept or ad test.",
        attributes: [
          { name: "id", type: "integer", description: "Unique identifier for the product. Use it to create an order." },
          { name: "name", type: "string", description: "The product's name." },
          { name: "description", type: "string", description: "A short description of the product." },
        ],
        example: product,
      },
      {
        kind: "endpoint",
        id: "products-list",
        title: "List products",
        method: "GET",
        path: "/products",
        description: "Returns the products available to the customer group.",
        scope: "read_products",
        rateLimit: PER_MINUTE(60),
        queryParams: pagination,
        returns: "A page of [Product objects](#products-object) and the `next_cursor` for the following page.",
        request: { method: "GET", path: "/products" },
        response: {
          status: 200,
          body: {
            products: [product, { id: 3, name: "Zappi Ad Test", description: "Test video ads before they air." }],
            next_cursor: null,
          },
        },
      },
    ],
  },
  {
    id: "teamspaces",
    label: "Teamspaces",
    description: "Teamspaces group a customer group's orders by team.",
    sections: [
      {
        kind: "object",
        id: "teamspaces-object",
        title: "The Teamspace object",
        description: "A teamspace is a space within the customer group where a team keeps its orders.",
        attributes: [
          { name: "uuid", type: "string", description: "Unique identifier for the teamspace." },
          { name: "name", type: "string", description: "The teamspace's name." },
          {
            name: "private",
            type: "boolean",
            description: "`true` if the teamspace is private, `false` if it's shared with the whole organisation.",
          },
        ],
        example: teamspace,
      },
      {
        kind: "endpoint",
        id: "teamspaces-list",
        title: "List teamspaces",
        method: "GET",
        path: "/teamspaces",
        description: "Returns the teamspaces the customer belongs to in the customer group.",
        scope: "read_teamspaces",
        rateLimit: PER_MINUTE(60),
        queryParams: [customerEmail, ...pagination],
        returns: "A page of [Teamspace objects](#teamspaces-object) and the `next_cursor` for the following page.",
        request: { method: "GET", path: "/teamspaces", query: { customer_email: "name@domain.com" } },
        response: {
          status: 200,
          body: {
            teamspaces: [teamspace, { uuid: "9c5b94b1-35ad-49bb-b118-8e8fc24abf80", name: "Innovation", private: true }],
            next_cursor: null,
          },
        },
      },
    ],
  },
  {
    id: "webhooks",
    label: "Webhooks",
    description: "Subscribe to events to have Zappi notify your server when they happen.",
    sections: [
      {
        kind: "object",
        id: "event-subscriptions-object",
        title: "The Event Subscription object",
        description: "An event subscription asks Zappi to send an event about an order to your `callback_uri`.",
        attributes: eventSubscriptionAttributes,
        example: eventSubscription,
      },
      {
        kind: "endpoint",
        id: "event-subscriptions-create",
        title: "Create an event subscription",
        method: "POST",
        path: "/event_subscriptions",
        description: "Subscribes to an event for an order.",
        scope: "write_event_subscriptions",
        rateLimit: PER_MINUTE(5),
        callouts: [
          {
            type: "note",
            text: "You can only subscribe while the order's status is `configuration`, and the `callback_uri` host must be on your integration's allowlist. Otherwise the request fails with error `1021`.",
          },
        ],
        bodyWrapper: "event_subscription",
        bodyParams: [
          {
            name: "event_type",
            type: "string",
            required: true,
            description: "The event to subscribe to.",
            values: ["order_completed"],
          },
          {
            name: "callback_uri",
            type: "string",
            required: true,
            description: "An `http` or `https` URI to send the event to. Its host must be on your integration's allowlist.",
          },
          { name: "order_id", type: "integer", required: true, description: "The order to watch." },
        ],
        returns: "The new [Event Subscription object](#event-subscriptions-object), with a `201` status.",
        request: {
          method: "POST",
          path: "/event_subscriptions",
          body: {
            event_subscription: {
              event_type: "order_completed",
              callback_uri: "https://example.com/zappi/webhooks",
              order_id: 4,
            },
          },
        },
        response: { status: 201, body: { event_subscription: eventSubscription } },
      },
      {
        kind: "endpoint",
        id: "event-subscriptions-list",
        title: "List event subscriptions",
        method: "GET",
        path: "/event_subscriptions",
        description: "Returns your event subscriptions for the installation, newest first.",
        scope: "read_event_subscriptions",
        rateLimit: PER_MINUTE(60),
        queryParams: [
          {
            name: "limit",
            type: "integer",
            description: "The number of results to return, from 1 to 500. Defaults to 100.",
          },
          pagination[1],
        ],
        returns:
          "A page of [Event Subscription objects](#event-subscriptions-object) and the `next_cursor` for the following page.",
        request: { method: "GET", path: "/event_subscriptions" },
        response: { status: 200, body: { event_subscriptions: [eventSubscription], next_cursor: null } },
      },
      {
        kind: "endpoint",
        id: "event-subscriptions-retrieve",
        title: "Retrieve an event subscription",
        method: "GET",
        path: "/event_subscriptions/{id}",
        description: "Returns a single event subscription.",
        scope: "read_event_subscriptions",
        rateLimit: PER_MINUTE(60),
        pathParams: [{ name: "id", type: "integer", required: true, description: "The subscription's ID." }],
        returns: "An [Event Subscription object](#event-subscriptions-object).",
        request: { method: "GET", path: "/event_subscriptions/1" },
        response: { status: 200, body: { event_subscription: eventSubscription } },
      },
      {
        kind: "endpoint",
        id: "event-subscriptions-delete",
        title: "Delete an event subscription",
        method: "DELETE",
        path: "/event_subscriptions/{id}",
        description: "Deletes an event subscription. Zappi stops sending its events.",
        scope: "write_event_subscriptions",
        rateLimit: PER_MINUTE(60),
        pathParams: [{ name: "id", type: "integer", required: true, description: "The subscription's ID." }],
        returns: "An empty response with a `204` status.",
        request: { method: "DELETE", path: "/event_subscriptions/1" },
        response: { status: 204, body: null },
      },
      { kind: "guide", id: "event-types" },
      { kind: "guide", id: "webhook-security" },
    ],
  },
];

