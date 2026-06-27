/**
 * @param {{ data: Record<string, unknown> | Record<string, unknown>[] }} props
 */
export default function JsonLd({ data }) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <>
      {payload.map((entry, index) => (
        <script
          key={`${String(entry["@type"] ?? "schema")}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  );
}
