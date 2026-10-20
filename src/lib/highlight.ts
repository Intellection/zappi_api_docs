import { createHighlighter, type HighlighterGeneric, type ThemeRegistration } from "shiki";

// Syntax colours from the Zappi DS, the same palette the Slate theme used
const zappiDark: ThemeRegistration = {
  name: "zappi-dark",
  type: "dark",
  colors: {
    "editor.background": "#00000000",
    "editor.foreground": "#ffffffd9",
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#818181" } },
    {
      scope: ["string", "string.quoted", "string.template", "punctuation.definition.string"],
      settings: { foreground: "#9BDA9B" },
    },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#81C7FF" } },
    {
      scope: ["support.type.property-name", "entity.name.tag", "entity.other.attribute-name", "variable.other.property"],
      settings: { foreground: "#FF9FB4" },
    },
    {
      scope: ["keyword", "storage", "storage.type", "support.function.builtin", "entity.name.type", "support.class"],
      settings: { foreground: "#FFE746" },
    },
    { scope: ["entity.name.function", "support.function"], settings: { foreground: "#81C7FF" } },
    { scope: ["invalid"], settings: { foreground: "#DB4A46" } },
  ],
};

const LANGS = ["bash", "javascript", "python", "ruby", "php", "go", "java", "csharp", "json"];

let highlighter: Promise<HighlighterGeneric<any, any>> | undefined;

export async function highlight(code: string, lang: string): Promise<string> {
  highlighter ??= createHighlighter({ themes: [zappiDark], langs: LANGS });
  return (await highlighter).codeToHtml(code, { lang, theme: "zappi-dark" });
}
