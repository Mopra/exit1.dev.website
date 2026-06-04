import type { Faq } from "@/lib/publicMonitors";

/**
 * Visible FAQ. The exact same array is emitted as FAQPage JSON-LD on the page,
 * so the rendered text and the structured data never drift. Pure server markup
 * — no accordion JS, so every answer is crawlable on first paint.
 */
export function StatusFaq({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="space-y-8">
      {faqs.map((f) => (
        <div key={f.question}>
          <h3 className="mb-2 text-base font-semibold text-foreground">{f.question}</h3>
          <p className="text-sm leading-relaxed text-foreground/70">{f.answer}</p>
        </div>
      ))}
    </div>
  );
}
