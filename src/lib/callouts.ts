import type {} from "mdast-util-directive";
import type {} from "mdast-util-to-hast";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";

const LABELS: Record<string, string> = { note: "Note", warning: "Warning", tip: "Tip" };

// Turns `:::note`, `:::warning` and `:::tip` blocks in guides into callouts
export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective" || !(node.name in LABELS)) return;

      node.data = { hName: "aside", hProperties: { className: ["callout", `callout-${node.name}`] } };
      node.children.unshift({
        type: "paragraph",
        data: { hName: "strong", hProperties: { className: ["callout-label"] } },
        children: [{ type: "text", value: LABELS[node.name] }],
      });
    });
  };
}
