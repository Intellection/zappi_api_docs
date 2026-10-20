import { getCollection, type CollectionEntry } from "astro:content";
import { domains } from "../data/reference";
import type { HttpMethod } from "../data/types";

export type NavItem = { id: string; label: string; method?: HttpMethod };
export type NavGroup = { id: string; label: string; items: NavItem[] };

export async function guidesById(): Promise<Map<string, CollectionEntry<"guides">>> {
  return new Map((await getCollection("guides")).map((guide) => [guide.id, guide]));
}

// General guides have an `order`; the sidebar lists them above the reference
export async function generalGuides(): Promise<CollectionEntry<"guides">[]> {
  return (await getCollection("guides"))
    .filter((guide) => guide.data.order !== undefined)
    .sort((a, b) => a.data.order! - b.data.order!);
}

export async function navigation(): Promise<{ general: NavItem[]; reference: NavGroup[] }> {
  const guides = await guidesById();
  const general = (await generalGuides()).map((guide) => ({
    id: guide.id,
    label: guide.data.navLabel ?? guide.data.title,
  }));

  const reference = domains.map((domain) => ({
    id: domain.id,
    label: domain.label,
    items: domain.sections.map((section) => {
      if (section.kind === "endpoint") return { id: section.id, label: section.title, method: section.method };
      if (section.kind === "object") return { id: section.id, label: section.title };
      const guide = guides.get(section.id);
      if (!guide) throw new Error(`Domain ${domain.id} references a missing guide: ${section.id}`);
      return { id: guide.id, label: guide.data.navLabel ?? guide.data.title };
    }),
  }));

  return { general, reference };
}
