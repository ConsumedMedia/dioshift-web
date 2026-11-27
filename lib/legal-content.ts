import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";
import { formatLegalDate } from "@/lib/legal";

/*
 * Renders content/legal/*.md for the /terms and /privacy pages.
 *
 * The markdown is approved legal text: it is rendered exactly as written.
 * The only substitution is the "[publish date]" placeholder, which becomes
 * LEGAL_EFFECTIVE_DATE from lib/legal.ts.
 *
 * Both pages are static, so this runs at build time (readFileSync is fine
 * with Cache Components: it completes during prerender).
 */

export type LegalDocName = "terms" | "privacy";

export interface LegalDoc {
  title: string;
  html: string;
  /** The numbered sections, for the table of contents. */
  toc: Array<{ id: string; text: string }>;
}

/** Matches the escaped placeholder as written in the markdown: \[publish date\] */
const DATE_PLACEHOLDER = /\\\[publish date\\\]/g;

/** "7. Canceling your plan" -> "canceling-your-plan" (numbers left out so links survive renumbering). */
function slugify(text: string): string {
  return text
    .replace(/^\d+\.\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const marked = new Marked({
  gfm: true,
  async: false,
  renderer: {
    // Give h2/h3 ids so the table of contents (and other pages) can link to them.
    // The page supplies the h1, so the document's own top heading is dropped before parsing.
    heading({ tokens, depth, text }: Tokens.Heading) {
      const inner = this.parser.parseInline(tokens);
      return `<h${depth} id="${slugify(text)}">${inner}</h${depth}>\n`;
    },
  },
});

function load(name: LegalDocName): LegalDoc {
  const file = path.join(process.cwd(), "content", "legal", `${name}.md`);
  const source = readFileSync(file, "utf8").replace(/\r\n/g, "\n");

  // First line is "# Title". The page shows it as its h1.
  const match = source.match(/^#\s+(.+)\n/);
  if (!match) throw new Error(`${file} must start with a "# Title" line.`);
  const title = match[1].trim();
  const body = source.slice(match[0].length).replace(DATE_PLACEHOLDER, formatLegalDate());

  const toc = marked
    .lexer(body)
    .filter((t): t is Tokens.Heading => t.type === "heading" && t.depth === 2)
    .map((t) => ({ id: slugify(t.text), text: t.text }));

  const html = marked.parse(body) as string;
  if (html.includes("publish date")) {
    throw new Error(`${file}: the [publish date] placeholder wasn't replaced. Check its spelling.`);
  }

  return { title, html, toc };
}

const cache = new Map<LegalDocName, LegalDoc>();

export function getLegalDoc(name: LegalDocName): LegalDoc {
  let doc = cache.get(name);
  if (!doc) {
    doc = load(name);
    cache.set(name, doc);
  }
  return doc;
}
