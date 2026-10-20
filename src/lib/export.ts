import { domains } from "../data/reference";
import { domainMarkdown, endpointMarkdown, guideMarkdown, objectMarkdown } from "./markdown";
import { generalGuides, guidesById } from "./nav";
import { snippets } from "./snippets";

export type ExportedSection = { id: string; title: string; markdown: string };

// Every section of the reference as Markdown, in page order
export async function exportedSections(): Promise<ExportedSection[]> {
  const guides = await guidesById();
  const general = (await generalGuides()).map((guide) => ({
    id: guide.id,
    title: guide.data.title,
    markdown: guideMarkdown(guide.data.title, guide.body ?? ""),
  }));

  const reference = domains.flatMap((domain) => [
    { id: domain.id, title: domain.label, markdown: domainMarkdown(domain) },
    ...domain.sections.map((section) => {
      if (section.kind === "endpoint") {
        return {
          id: section.id,
          title: section.title,
          markdown: endpointMarkdown(section, snippets(section.request)[0].code),
        };
      }
      if (section.kind === "object") return { id: section.id, title: section.title, markdown: objectMarkdown(section) };
      const guide = guides.get(section.id)!;
      return { id: guide.id, title: guide.data.title, markdown: guideMarkdown(guide.data.title, guide.body ?? "") };
    }),
  ]);

  return [...general, ...reference];
}
