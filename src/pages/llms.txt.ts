import type { APIRoute } from "astro";
import { exportedSections } from "../lib/export";

// https://llmstxt.org: an index of the docs in Markdown for LLMs and agents
export const GET: APIRoute = async ({ site }) => {
  const sections = await exportedSections();
  const body = [
    "# Zappi API",
    "",
    "> The Zappi API lets approved public integrations create and track research orders for a Zappi customer group, download their deliverables, and receive webhooks when orders complete.",
    "",
    `The full reference as one file: ${new URL("/llms-full.txt", site)}`,
    "",
    "## Sections",
    "",
    ...sections.map((section) => `- [${section.title}](${new URL(`/md/${section.id}.txt`, site)})`),
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
