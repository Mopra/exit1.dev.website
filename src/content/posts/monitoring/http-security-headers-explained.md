---
title: "HTTP Security Headers Explained: A Complete Checklist"
author: "Exit1 Team"
date: "2026-03-10"
category: "monitoring"
excerpt: "Every HTTP security header explained: what it does, why it matters, and how to implement it. Check your site's headers for free with our API status checker."
readTime: "8 min read"
metaDescription: "HTTP security headers explained: HSTS, CSP, X-Frame-Options, CORS, and more. Complete checklist with implementation examples. Free security header checker included."
---

# HTTP Security Headers Explained: A Complete Checklist

Security headers are HTTP response headers that tell browsers how to handle your site's content. They prevent cross-site scripting, clickjacking, MIME sniffing, and other attacks that exploit browser behavior.

Most websites are missing critical security headers. A quick scan with our [free API status checker](/tools/api-status-checker) shows exactly which headers you have and which you're missing.

## Check Your Headers Now

Before reading further, run your site through the [API status checker](/tools/api-status-checker). It audits your security headers and shows what's configured, what's missing, and what's misconfigured. You'll know exactly which sections of this guide apply to you.

## Strict-Transport-Security (HSTS)

**What it does**: Tells browsers to only connect to your site over HTTPS, even if the user types `http://`.

**Why it matters**: Without HSTS, an attacker on the same network can intercept the initial HTTP request before it redirects to HTTPS (a "SSL stripping" attack).

**Implementation**:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

- `max-age=31536000`: Remember for 1 year (in seconds)
- `includeSubDomains`: Apply to all subdomains too
- `preload`: Eligible for browser preload lists (hardcoded HTTPS)

**Best practice**: Start with a short `max-age` (e.g., 300 seconds) and increase after confirming HTTPS works everywhere.

## Content-Security-Policy (CSP)

**What it does**: Controls which resources (scripts, styles, images, fonts) can load on your page.

**Why it matters**: CSP is the most effective defense against XSS (cross-site scripting) attacks. It prevents injected scripts from executing.

**Basic implementation**:
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'
```

**Common directives**:
- `default-src`: Fallback for all resource types
- `script-src`: Where JavaScript can load from
- `style-src`: Where CSS can load from
- `img-src`: Where images can load from
- `connect-src`: Where fetch/XHR requests can go
- `frame-ancestors`: Who can embed your page in an iframe

**Start with report-only mode** to find violations without breaking your site:
```
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report
```

## X-Content-Type-Options

**What it does**: Prevents browsers from MIME-sniffing a response away from the declared content type.

**Why it matters**: Without it, a browser might interpret a text file as JavaScript and execute it, enabling attacks.

**Implementation**:
```
X-Content-Type-Options: nosniff
```

This is a single-value header. There's only one correct setting.

## X-Frame-Options

**What it does**: Controls whether your site can be embedded in iframes.

**Why it matters**: Prevents clickjacking attacks where an attacker overlays an invisible iframe of your site over a fake page to trick users into clicking.

**Implementation**:
```
X-Frame-Options: DENY
```

Options:
- `DENY`: Never allow framing
- `SAMEORIGIN`: Only allow framing from the same origin
- `ALLOW-FROM uri`: Allow framing from a specific URL (deprecated in modern browsers)

**Note**: CSP's `frame-ancestors` directive is the modern replacement, but `X-Frame-Options` still provides backward compatibility.

## Referrer-Policy

**What it does**: Controls how much referrer information is sent when navigating away from your site.

**Why it matters**: Referrer headers can leak sensitive URL paths, query parameters, and user identifiers to external sites.

**Implementation**:
```
Referrer-Policy: strict-origin-when-cross-origin
```

Common values:
- `no-referrer`: Never send referrer
- `strict-origin-when-cross-origin`: Send full URL for same-origin, only origin for cross-origin HTTPS, nothing for HTTP
- `same-origin`: Only send referrer for same-origin requests

## Permissions-Policy (formerly Feature-Policy)

**What it does**: Controls which browser features and APIs your site can use.

**Why it matters**: Prevents malicious scripts from accessing cameras, microphones, geolocation, and other sensitive APIs.

**Implementation**:
```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

The `()` means the feature is disabled entirely. Specify origins to allow specific uses:
```
Permissions-Policy: camera=(self "https://meet.example.com")
```

## Cross-Origin Headers (CORS)

**What they do**: Control which origins can access your resources via JavaScript.

**Why they matter**: Without proper CORS configuration, your API might accept requests from any origin (too open) or reject legitimate requests (too restrictive).

**Key headers**:
```
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

The [API status checker](/tools/api-status-checker) shows your CORS configuration, including whether you're using the wildcard `*` origin (which is a security risk for authenticated APIs).

## Cache-Control

**What it does**: Controls how browsers and CDNs cache your responses.

**Why it matters**: Sensitive pages cached inappropriately can be served to the wrong users.

**For sensitive pages**:
```
Cache-Control: no-store, no-cache, must-revalidate, private
```

**For static assets**:
```
Cache-Control: public, max-age=31536000, immutable
```

## Security Headers Checklist

Run the [API status checker](/tools/api-status-checker) on your site and verify each header:

- [ ] **Strict-Transport-Security** — HTTPS enforcement with appropriate max-age
- [ ] **Content-Security-Policy** — XSS protection with explicit source allowlists
- [ ] **X-Content-Type-Options: nosniff** — MIME sniffing prevention
- [ ] **X-Frame-Options: DENY** — Clickjacking protection
- [ ] **Referrer-Policy** — Referrer information control
- [ ] **Permissions-Policy** — Browser API access control
- [ ] **CORS** — Appropriate origin restrictions for APIs
- [ ] **Cache-Control** — Correct caching for sensitive vs. static content

## Implementation by Server

### Nginx

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

### Apache

```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

### Vercel (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

## Monitoring Your Security Headers

Security headers can break when you update server configurations, change CDN providers, or modify your deployment pipeline. Use the [API status checker](/tools/api-status-checker) to verify headers after any infrastructure change.

For continuous monitoring, exit1.dev checks your endpoints regularly and can alert you when security configurations change unexpectedly.

---

## Recommended Resources

- [Free API Status Checker](/tools/api-status-checker) – Audit your security headers, response codes, and CORS configuration
- [Free SSL Checker](/tools/ssl-checker) – Verify your SSL/TLS configuration alongside security headers
- [API Endpoint Monitoring Playbook](/blog/api-endpoint-monitoring-playbook-2025) – Build comprehensive API monitoring
- [API Observability Automation Toolkit](/blog/api-observability-automation-toolkit) – Automate your monitoring stack
