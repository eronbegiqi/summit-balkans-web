export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractHeadings(
  content: string
): { id: string; label: string }[] {
  const regex = /^##\s+(.+)$/gm;
  const headings: { id: string; label: string }[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const label = match[1];
    headings.push({ id: slugify(label), label });
  }
  return headings;
}

export function formatLegalDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
