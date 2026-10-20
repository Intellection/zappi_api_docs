import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// Prose sections. General guides list in the sidebar's top block by `order`;
// the rest are placed inside a reference domain from src/data/reference.ts.
const guides = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    navLabel: z.string().optional(),
    eyebrow: z.string().optional(),
    order: z.number().optional(),
    // Panels for the right-hand code column
    examples: z
      .array(
        z.object({
          title: z.string(),
          lang: z.string(),
          code: z.string(),
          status: z.number().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { guides };
