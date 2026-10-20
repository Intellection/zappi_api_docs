import type { APIRoute, GetStaticPaths } from "astro";
import { exportedSections, type ExportedSection } from "../../lib/export";
import { absoluteLinks } from "../../lib/markdown";

export const getStaticPaths = (async () =>
  (await exportedSections()).map((section) => ({ params: { id: section.id }, props: section }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(absoluteLinks((props as ExportedSection).markdown), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
