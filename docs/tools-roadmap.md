# Free Tools Roadmap

*Ideas for expanding the /tools section to drive organic traffic and convert visitors to the exit1.dev monitoring platform.*

**Current tools:** SSL Certificate Checker, Domain Expiration Checker, API Status Checker, Ping Test

---

## Tier 1 — High Priority (Strong SEO + Direct Funnel to Monitoring)

These tools have high search volume, directly relate to exit1.dev's core monitoring product, and naturally lead users toward signing up.

### DNS Lookup Tool
- Query A, AAAA, CNAME, MX, TXT, NS, SOA, CAA records for any domain
- Show TTL values, propagation status across multiple DNS resolvers
- Compare authoritative vs recursive results
- **Funnel angle:** "Monitor DNS changes automatically with exit1.dev"
- **Implementation:** Server-side using Node `dns` module + public DNS APIs (Google 8.8.8.8, Cloudflare 1.1.1.1)

### HTTP Security Headers Checker
- Deep audit of CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, Referrer-Policy, CORS
- Letter grade (A-F) with per-header pass/fail and remediation guidance
- Compare against OWASP recommendations
- **Funnel angle:** "Get alerted when your security headers change — exit1.dev monitors this for you"
- **Implementation:** Extends existing API status checker pattern; server-side fetch + header parsing

### Website Speed Test / TTFB Checker
- Measure Time to First Byte, DNS resolution time, TLS handshake time, content download time
- Show waterfall breakdown of connection phases
- Compare against industry benchmarks
- **Funnel angle:** "Track response time trends over time with exit1.dev monitoring"
- **Implementation:** Server-side using Node `http`/`https` with socket timing events

### DMARC / SPF / DKIM Validator
- Parse and validate SPF records (check includes, mechanisms, lookup limits)
- Parse DMARC records (policy, reporting, alignment)
- Check DKIM selector records
- Show plain-English explanation of what each record does
- **Funnel angle:** "Monitor your email authentication records for changes"
- **Implementation:** Server-side DNS TXT lookups + custom parsing logic

### Redirect Chain Checker
- Follow full redirect chain (301, 302, 307, 308, meta refresh, JS redirects)
- Show each hop with status code, headers, response time
- Flag common SEO issues (redirect loops, chains > 3 hops, mixed HTTP/HTTPS)
- **Funnel angle:** "Monitor your redirects — get alerted when chains break"
- **Implementation:** Server-side fetch with redirect: "manual" + iterative following

---

## Tier 2 — Medium Priority (High Traffic Developer Utilities)

These are high-search-volume developer utilities. They don't directly relate to monitoring but drive massive organic traffic and brand awareness among the target audience.

### JSON Formatter / Validator
- Paste or fetch JSON from URL, pretty-print with syntax highlighting
- Validate with detailed error messages (line/column)
- Minify, sort keys, convert to YAML/CSV
- Tree view for exploring nested structures
- **Implementation:** Client-side only (no API route needed). Use native JSON.parse + custom formatter

### JWT Decoder
- Paste a JWT, decode header and payload
- Show expiration status (expired/valid/not-yet-valid)
- Verify signature with provided secret (HS256) or public key (RS256)
- Highlight common claims (iss, sub, exp, iat, aud)
- **Implementation:** Client-side only. Base64 decode + optional crypto verification

### Base64 Encode / Decode
- Text to Base64 and back
- File/image to Base64 data URI
- URL-safe Base64 variant
- **Implementation:** Client-side only

### URL Encoder / Decoder
- Encode/decode full URLs or individual components
- Show breakdown of URL parts (protocol, host, path, query params, fragment)
- Parse and edit query parameters as key-value pairs
- **Implementation:** Client-side only

### Cron Expression Parser
- Enter cron expression, see plain-English explanation
- Show next N scheduled run times
- Support standard (5-field) and extended (6-field with seconds) formats
- Visual schedule calendar/timeline
- **Implementation:** Client-side only. Use a cron parsing library or custom parser

### Regex Tester
- Enter regex pattern and test string, highlight matches in real-time
- Show capture groups, match indices
- Quick reference for common patterns
- Support JavaScript, Python, Go regex flavors
- **Implementation:** Client-side only

### Hash Generator
- Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or file input
- Compare two hashes for verification
- **Implementation:** Client-side using Web Crypto API

---

## Tier 3 — Lower Priority (Niche but Valuable)

Useful additions that serve specific audiences and round out the toolkit.

### IP Address Lookup / Geolocation
- Show IP info: ASN, ISP, organization, approximate geolocation
- Support both IPv4 and IPv6
- Show reverse DNS (PTR record)
- "What is my IP" feature
- **Implementation:** Server-side using free IP geolocation APIs (ip-api.com, ipinfo.io free tier)

### Port Scanner
- Check if common ports are open on a host (80, 443, 22, 21, 25, 3306, 5432, 6379, 8080, 8443)
- Custom port input
- Show service name for known ports
- **Implementation:** Server-side TCP connect with timeout. Needs careful rate limiting and abuse prevention

### WHOIS Lookup (Standalone)
- Full raw WHOIS output for any domain
- Parsed key fields (registrar, dates, nameservers, status codes)
- Different from Domain Expiration Checker — this shows complete raw data
- **Implementation:** Server-side using WHOIS protocol (TCP port 43) or RDAP with raw output

### Reverse DNS Lookup
- IP to hostname resolution
- Bulk lookup support (paste list of IPs)
- **Implementation:** Server-side using Node `dns.reverse()`

### SSL Certificate Decoder (PEM)
- Paste a PEM certificate, decode and display all fields
- Show validity period, SANs, key usage, issuer chain
- Complementary to the SSL Checker (that one fetches live; this one decodes a local cert)
- **Implementation:** Client-side using Web Crypto API or lightweight ASN.1 parser

### Subnet Calculator
- Enter IP + CIDR, show network address, broadcast, host range, number of hosts
- Supernet/subnet operations
- IPv4 and IPv6 support
- **Implementation:** Client-side only

### HTTP Status Code Reference
- Searchable reference of all HTTP status codes with descriptions and common causes
- "When to use" guidance for API developers
- **Implementation:** Client-side only, static content (great for SEO)

### User-Agent Parser
- Paste a user-agent string, decode browser, OS, device type, bot detection
- "What is my user-agent" feature
- **Implementation:** Client-side parsing with a UA parser library

### Color Converter
- Convert between HEX, RGB, HSL, OKLCH, Tailwind color names
- Color picker with preview
- Contrast ratio checker (WCAG AA/AAA compliance)
- **Implementation:** Client-side only

### Markdown Preview
- Paste Markdown, see rendered HTML preview side-by-side
- Support GitHub Flavored Markdown (tables, task lists, syntax highlighting)
- Copy rendered HTML output
- **Implementation:** Client-side only

### Timestamp Converter
- Convert between Unix timestamps, ISO 8601, RFC 2822, and human-readable dates
- Show "time ago" relative format
- Timezone conversion
- "Current timestamp" feature
- **Implementation:** Client-side only

### Lorem Ipsum / Placeholder Generator
- Generate placeholder text (lorem ipsum, random words, realistic names/emails/addresses)
- Generate placeholder images (colored rectangles with dimensions)
- Configurable length (words, sentences, paragraphs)
- **Implementation:** Client-side only

### Diff Checker
- Paste two text blocks, show side-by-side or inline diff
- Syntax-aware diffing for JSON, HTML, CSS
- Highlight additions, deletions, modifications
- **Implementation:** Client-side only

### CIDR / IP Range Calculator
- Convert between CIDR notation and IP ranges
- Check if an IP falls within a CIDR block
- Merge overlapping ranges
- **Implementation:** Client-side only

### Webhook Tester / Request Bin
- Generate a temporary URL that captures incoming HTTP requests
- Show method, headers, body, timing for each request
- Useful for debugging webhooks
- **Funnel angle:** "Set up production webhook alerts with exit1.dev"
- **Implementation:** Requires server-side endpoint + temporary storage (could use in-memory or short-lived KV)

---

## Implementation Notes

### Shared patterns from existing tools
- All tools use client components (`"use client"`) with server-side API routes for external lookups
- URL query params for shareable results (e.g., `?domain=example.com`)
- Collapsible SectionCard components for organizing results
- Copy to clipboard + Download as text file export options
- Example inputs for quick testing (google.com, github.com, etc.)
- Loading states with multi-step progress indicators
- Color-coded grading systems (emerald = good, red = bad, yellow = warning)
- SSRF protection (block private/reserved IPs) on all server-side routes

### Client-side-only tools (Tier 2)
- No API route needed — faster to build, zero server cost
- Still wrap in the same UI patterns (SectionCard, copy/download, examples)
- Great for SEO landing pages with minimal infrastructure

### SEO considerations
- Each tool should have its own page with unique meta title/description targeting specific search queries
- Add structured data (FAQ schema) where applicable
- Internal linking between related tools (e.g., SSL Checker links to Security Headers Checker)
- Blog posts that reference tools as practical resources

### Conversion touchpoints
- Each tool result should include a contextual CTA to the exit1.dev monitoring platform
- CTAs should relate to the specific tool (e.g., DNS Lookup → "Monitor DNS changes", Speed Test → "Track response times over time")
- Non-intrusive placement: below results, not blocking them
