// @ts-check
import { defineConfig } from "astro/config";
import remarkDirective from "remark-directive";
import { remarkCallouts } from "./src/lib/callouts.ts";

export default defineConfig({
  site: "https://developers.zappi.io",
  // The nginx image serves /srv/code/build, as it did for Slate
  outDir: "./build",
  markdown: {
    remarkPlugins: [remarkDirective, remarkCallouts],
  },
});
