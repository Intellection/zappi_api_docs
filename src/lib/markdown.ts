import { marked } from "marked";
import { BASE_URL } from "./snippets";
import type { Domain, Endpoint, Field, ObjectDef } from "../data/types";

export const inline = (text: string): string => marked.parseInline(text, { async: false });

// Exports are read outside the page, so in-page links need the full URL
export const absoluteLinks = (markdown: string) => markdown.replaceAll("](#", "](https://developers.zappi.io/#");

// Markdown exports of each section, for "Copy for LLM", /md/*.md and llms-full.txt

function fieldLines(fields: Field[], depth = 0): string[] {
  return fields.flatMap((field) => {
    const pad = "  ".repeat(depth);
    const required = field.required ? ", required" : "";
    const values = field.values ? ` One of: ${field.values.map((v) => `\`${v}\``).join(", ")}.` : "";
    return [
      `${pad}- \`${field.name}\` (${field.type}${required}): ${field.description}${values}`,
      ...fieldLines(field.children ?? [], depth + 1),
    ];
  });
}

const fieldBlock = (heading: string, fields?: Field[]) =>
  fields?.length ? [`### ${heading}`, "", ...fieldLines(fields), ""] : [];

const jsonBlock = (value: unknown) => ["```json", JSON.stringify(value, null, 2), "```", ""];

export function endpointMarkdown(endpoint: Endpoint, curl: string): string {
  const body = endpoint.bodyWrapper
    ? `Body parameters (sent inside a \`${endpoint.bodyWrapper}\` object)`
    : "Body parameters";
  return [
    `## ${endpoint.title}`,
    "",
    `\`${endpoint.method} ${BASE_URL}${endpoint.path}\``,
    "",
    endpoint.description,
    "",
    ...(endpoint.scope ? [`Requires the \`${endpoint.scope}\` scope.`, ""] : []),
    ...(endpoint.rateLimit ? [`Rate limit: ${endpoint.rateLimit}.`, ""] : []),
    ...(endpoint.callouts ?? []).flatMap((c) => [`> **${c.type[0].toUpperCase()}${c.type.slice(1)}:** ${c.text}`, ""]),
    ...fieldBlock("Path parameters", endpoint.pathParams),
    ...fieldBlock("Query parameters", endpoint.queryParams),
    ...fieldBlock(body, endpoint.bodyParams),
    "### Returns",
    "",
    endpoint.returns,
    "",
    ...(endpoint.responseFields ? [...fieldLines(endpoint.responseFields), ""] : []),
    "### Example request",
    "",
    "```bash",
    curl,
    "```",
    "",
    `### Example response (${endpoint.response.status})`,
    "",
    ...(endpoint.response.body === null ? ["No content.", ""] : jsonBlock(endpoint.response.body)),
  ].join("\n");
}

export function objectMarkdown(object: ObjectDef): string {
  return [
    `## ${object.title}`,
    "",
    object.description,
    "",
    ...fieldBlock("Attributes", object.attributes),
    "### Example",
    "",
    ...jsonBlock(object.example),
  ].join("\n");
}

export function guideMarkdown(title: string, body: string): string {
  return [`## ${title}`, "", body.trim(), ""].join("\n");
}

export function domainMarkdown(domain: Domain): string {
  return [`# ${domain.label}`, "", domain.description, ""].join("\n");
}
