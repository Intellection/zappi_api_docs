import type { Json, RequestExample } from "../lib/snippets";

export type HttpMethod = RequestExample["method"];

// Descriptions are inline Markdown: `code`, **bold** and [links](#id) work
export type Field = {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  values?: string[];
  children?: Field[];
};

export type Callout = {
  type: "note" | "warning" | "tip";
  text: string;
};

export type Endpoint = {
  kind: "endpoint";
  id: string;
  title: string;
  method: HttpMethod;
  path: string;
  description: string;
  scope?: string;
  rateLimit?: string;
  pathParams?: Field[];
  queryParams?: Field[];
  // Body parameters sit inside this key, e.g. { "order": { ... } }
  bodyWrapper?: string;
  bodyParams?: Field[];
  returns: string;
  // Documents the fields of a response that isn't one of the objects
  responseFields?: Field[];
  callouts?: Callout[];
  request: RequestExample;
  response: { status: number; body: Json | null };
};

export type ObjectDef = {
  kind: "object";
  id: string;
  title: string;
  description: string;
  attributes: Field[];
  example: Json;
};

// A Markdown page from src/content/guides placed inside a reference domain
export type GuideRef = {
  kind: "guide";
  id: string;
};

export type Domain = {
  id: string;
  label: string;
  description: string;
  sections: (Endpoint | ObjectDef | GuideRef)[];
};
