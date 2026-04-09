---
title: "Free CNAME Lookup Tool — Check CNAME Records for Any Domain"
author: "Morten Pradsgaard"
date: "2026-04-02"
category: "domain-intelligence"
excerpt: "Look up CNAME records to see where a domain is aliased."
readTime: "5 min read"
metaDescription: "Free CNAME record lookup tool. Check where any domain or subdomain is aliased, trace CNAME chains, and troubleshoot DNS configuration. No signup required."
---

# Free CNAME Lookup Tool — Check CNAME Records for Any Domain

*A CNAME record is an alias — it points one domain name to another instead of directly to an IP address. When your subdomain isn't resolving or your custom domain setup isn't working, a CNAME check is step one.*

**Check CNAME records now:** Our [free DNS Lookup Tool](/tools/dns-checker) shows CNAME records alongside all other record types for any domain.

## What Is a CNAME Record?

CNAME (Canonical Name) is a DNS record that creates an alias from one domain to another. Instead of resolving to an IP address directly, a CNAME tells the resolver to look up a different domain name.

**Example:**
```
www.example.com.    3600    IN    CNAME    example.com.
blog.example.com.   3600    IN    CNAME    mysite.netlify.app.
shop.example.com.   3600    IN    CNAME    shops.myshopify.com.
```

When someone visits `blog.example.com`, the resolver sees the CNAME, then looks up the A/AAAA records for `mysite.netlify.app` and connects to that IP.

## How to Look Up CNAME Records

### Method 1: DNS Lookup Tool

Enter any domain or subdomain in our [DNS Lookup Tool](/tools/dns-checker). If a CNAME exists, it appears in the "Address Records" section. If the domain has direct A/AAAA records instead of a CNAME, those are shown instead — you can't have both.

### Method 2: Command line

```bash
# Check for CNAME
dig www.example.com CNAME +short
# Output: example.com.

# Trace the full resolution chain
dig www.example.com A +trace
```

The `+trace` flag follows the entire resolution path, showing each CNAME hop and the final A record.

## When You Need CNAME Records

- **`www` subdomain** — `www.example.com` → `example.com`
- **Custom domains on SaaS platforms** — `blog.example.com` → `yoursite.wordpress.com`
- **CDN setup** — `cdn.example.com` → `d1234.cloudfront.net`
- **Custom domain for GitHub Pages** — `docs.example.com` → `username.github.io`
- **Email provider verification** — DKIM records are often CNAMEs to the provider's key servers

## The CNAME Rules

### A CNAME cannot coexist with other records

This is the most important CNAME rule. If `blog.example.com` has a CNAME, it **cannot** also have A, AAAA, MX, TXT, or any other record at that exact name. The CNAME "owns" the name exclusively.

This is why you can't put a CNAME on your root domain (`example.com`) if you also need MX records there (you do, for email). Solutions:

- Use an A/AAAA record at the root, CNAME only on subdomains
- Use your DNS provider's ALIAS/ANAME/CNAME flattening (Cloudflare, Route53, and others support this)

### CNAME chains should be short

A CNAME can point to another CNAME, creating a chain. But long chains slow down resolution and increase the chance of failure. Keep it to one hop when possible.

### CNAME targets must resolve

If `blog.example.com` points to `mysite.netlify.app` and that hostname doesn't resolve, your subdomain is broken too. When a hosting provider changes their CNAME target, you need to update yours.

## Troubleshooting CNAME Issues

### Subdomain doesn't resolve

1. **Check the CNAME exists:** Use our [DNS Lookup Tool](/tools/dns-checker) to verify
2. **Check the target resolves:** Look up the CNAME target separately — does it have A records?
3. **Check for conflicts:** Is there an A record AND a CNAME at the same name? Remove one.
4. **Check propagation:** Recently added CNAMEs take time to propagate. See our [propagation guide](/blog/dns-propagation-how-long-do-changes-take).

### Custom domain not working on hosting platform

Most platforms (Netlify, Vercel, Shopify, GitHub Pages) require you to:
1. Add a CNAME record pointing your subdomain to their target
2. Configure the custom domain in their dashboard

Both steps are required. The CNAME routes traffic to them; the dashboard config tells them to serve your site for that domain.

### SSL certificate errors on CNAME'd domain

The hosting provider needs to issue a certificate for your custom domain. Most do this automatically (via Let's Encrypt) once DNS resolves correctly. If you see SSL errors, check that your [CAA records](/blog/dns-record-types-explained#caa-record-certificate-authority-authorization) allow the provider's CA to issue certificates.

## CNAME vs A Record

| | CNAME | A Record |
|---|-------|----------|
| Points to | Another hostname | An IP address |
| Can be at root domain? | No (unless flattened) | Yes |
| Can coexist with other records? | No | Yes |
| Updates automatically if target IP changes? | Yes | No — you must update manually |
| Best for | Subdomains pointing to third-party services | Root domains, direct IP mappings |

**Use CNAME** when you want your subdomain to follow a third-party service's IP changes automatically. **Use A records** when you control the IP and need other record types at the same name.

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check CNAME and all other DNS records
- [DNS Record Types Explained](/blog/dns-record-types-explained) — Complete reference for every record type
- [DNS Propagation Guide](/blog/dns-propagation-how-long-do-changes-take) — Why DNS changes take time
- [Free A Record Lookup](/blog/free-a-record-lookup) — Check A records and IPv4 addresses
- [Free SSL Certificate Checker](/tools/ssl-checker) — Verify your SSL configuration
