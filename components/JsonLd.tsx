/**
 * Renders schema.org structured data. A plain <script> (not next/script),
 * as the Next.js JSON-LD guide recommends, since this is data, not code.
 */
export function JsonLd({ data }: { data: object }) {
  // Escape "<" so nothing in the data can close the script tag early.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
