import * as prod from "react/jsx-runtime";
import rehypeParse from "rehype-parse";
import rehypeReact, { type Components } from "rehype-react";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { Root } from "hast";

interface ProcessorOptions {
  components?: Partial<Components>;
}

const addHeadingIds = () => {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (["h2", "h3", "h4"].includes(node.tagName)) {
        const text = getTextContent(node);
        if (text) {
          node.properties = { ...node.properties, id: slugify(text) };
        }
      }
    });
    return tree;
  };
};

/**
 * Extracts all text content from a node, including nested elements.
 */
function getTextContent(node: any): string {
  if (!node.children) return "";
  return node.children
    .map((child: any) =>
      child.type === "text" ? child.value : getTextContent(child)
    )
    .join("")
    .trim();
}

/**
 * Generates a URL-safe slug from a string.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, "") // Remove special characters
    .replace(/[\s]+/g, "-") // Replace spaces with dashes
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

export function createProcessor({ components }: ProcessorOptions = {}) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(addHeadingIds)
    .use(rehypeReact, {
      Fragment: prod.Fragment,
      jsx: prod.jsx,
      jsxs: prod.jsxs,
      components,
    });
}
