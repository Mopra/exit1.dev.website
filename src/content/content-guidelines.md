# 🧠 Exit1.dev — Content Guidelines (DHH Edition)

## 1. Voice & Tone

### 🎙️ Inspired by DHH
- **Tone:** Confident, plainspoken, a little provocative  
- **Style:** No-nonsense, elegant minimalism  
- **Vibe:** The senior dev who tells it like it is — and is right more often than not

> “There’s no need for buzzwords when clarity wins. We solve problems, not impress investors.”

### Examples of Tone

| Situation              | Example Response                                              |
|------------------------|---------------------------------------------------------------|
| Uptime looks good      | “Everything’s up. That’s how it should be.” |
| A check failed         | “Something’s down. Time to fix it — not overthink it.” |
| Comparing competitors  | “They upsell alerts. We just give you what works.” |
| Explaining a tech term | “SSL expired. Your site’s screaming silently. We’ll let you know next time.” |

---

## 2. Personality

- **Opinionated**: We’re not for everyone — and that’s the point  
- **Direct**: Say the thing. Skip the fluff.  
- **Sharp**: Intellect over ego. Speak plainly, think deeply.  
- **Pragmatic**: If it works, it works. We don’t do hype.  

> Sound like someone who builds great tools, not someone selling a course on LinkedIn.

---

## 3. Writing Style

- Short, declarative sentences  
- Use real words, not jargon bingo  
- Talk *to* the reader, not *at* them  
- Avoid enthusiasm inflation. “Great” should mean something.  
- Be clear before clever. If you can do both — good.

---

## 4. Error & Alert Messaging

When things go wrong:
- Stay calm  
- State what happened  
- Suggest what to do next  

> ❌ “Something went terribly wrong at 02:41. Panic!”  
> ✅ “Site went down at 02:41. You’ll want to check that. We’re watching too.”

---

## 5. Competitor Shade (With a Raised Eyebrow)

Call out nonsense when it matters. But don’t be petty.

> “You could pay more to get less. Or you could just use Exit1.”  
> “Monitoring isn’t a luxury. It’s a baseline.”

Let the truth do the talking.

---

## 6. When to Be Serious

No jokes, no spin, just signal:
- Security issues  
- Data loss risks  
- Multi-site outages  

Speak like you’d want someone to speak to *you* in that moment.

---

## 7. Avoid

- ❌ Tech-evangelist fluff  
- ❌ MBA-speak (“ecosystem”, “stakeholder synergy”)  
- ❌ Nervous apologizing  
- ❌ Sounding like an over-eager intern  

---

## 8. Optional Easter Eggs

Use sparingly. Think small details with a smirk — not clowns in the footer.

- “Your uptime streak outlived three startups.”  
- “Monitoring like it’s 1999, but with less dial-up.”

Never distract from the work.

---

# 🤖 AI Content Guidelines

## Core Rules
- **Never** hardcode text in components  
- **Always** use JSON files in `src/content/`  
- **Always** use `contentLoader.ts` utilities

## File Structure
```
src/content/
├── *.json                  # Component content
├── posts/{category}/       # Blog posts (monitoring/guides/ai)
└── content-guidelines.md
```

## JSON Patterns

Used in homepage sections, CTA blocks, feature lists, etc.

**Title:**  
```json
{ "title": { "main": "text", "highlight": "text" } }
```

**CTA:**  
```json
{ "cta": { "primary": { "text": "text", "href": "url", "variant": "primary", "size": "lg" } } }
```

**List:**  
```json
{ "features": [{ "title": "text", "description": "text" }] }
```

## Blog Posts

- Location: `src/content/posts/{category}/`
- Frontmatter: `title`, `author`, `category`, `excerpt`, `readTime`
- Format: Markdown with short paragraphs  
- **Tone:** Same as the product: sharp, real, occasionally cheeky.

---

## Component Usage

```typescript
import { getHeroContent } from '../utils/contentLoader';
const content = getHeroContent();
return <h1>{content.title.main}</h1>;
```

---

## Accessibility

Basics matter. Check:
- Headings follow order  
- Alt text is descriptive  
- ARIA when necessary  

**Examples:**

```tsx
// ✅ Good
<img src="downtime.png" alt="Graph showing server downtime" />

// ❌ Bad
<img src="graph1.png" alt="" />
```

---

## Workflow

1. **Edit existing:** Modify JSON  
2. **New blog:** Create markdown with frontmatter  
3. **New component:** Add JSON → interface → getter → use it

---

## Validation

- JSON valid (no trailing commas)  
- Frontmatter complete  
- Markdown clean  
- Accessible and readable

---

## Common Patterns

```typescript
// ✅ Good
const content = getHeroContent();
return <h1>{content.title.main}</h1>;

// ❌ Bad
return <h1>Hardcoded text</h1>;
```

---

## Performance

- Import at build time  
- Tree-shakeable  
- SEO in mind  
- No runtime fetches

---

## Troubleshooting

1. JSON not valid? Fix that first.  
2. Getter missing? Add it.  
3. Component not importing? Check the path.  
4. Still broken? Read the console like a grown-up.

---