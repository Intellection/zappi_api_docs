import type { APIRoute } from "astro";
import { exportedSections } from "../lib/export";
import { absoluteLinks } from "../lib/markdown";

export const GET: APIRoute = async () => {
  const sections = await exportedSections();
  const body = absoluteLinks(["# Zappi API reference", "", ...sections.map((section) => section.markdown)].join("\n"));

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
