/**
 * Renders a JSON-LD <script> for structured data (rich results in search).
 * Server component; `data` is always our own trusted content.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so a value containing "</script>" can't break out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
