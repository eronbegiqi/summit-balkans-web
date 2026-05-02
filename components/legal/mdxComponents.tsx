import React from "react";
import { slugify } from "@/lib/legal";

function textContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (React.isValidElement(node)) {
    const el = node as React.ReactElement<{ children?: React.ReactNode }>;
    return textContent(el.props.children);
  }
  return "";
}

export const mdxComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(textContent(children));
    return (
      <h2 id={id}>
        {children}
      </h2>
    );
  },
  h3: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(textContent(children));
    return (
      <h3 id={id}>
        {children}
      </h3>
    );
  },
};
