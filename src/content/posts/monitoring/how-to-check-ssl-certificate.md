---
title: "How to Check an SSL Certificate: The Complete Guide"
author: "Exit1 Team"
date: "2026-03-12"
category: "monitoring"
excerpt: "Learn how to check any website's SSL certificate for expiration, issuer, TLS version, and security issues. Free methods and tools included."
readTime: "7 min read"
metaDescription: "How to check an SSL certificate: step-by-step guide to verify expiration dates, TLS versions, certificate chains, and security issues. Free tools included."
---

# How to Check an SSL Certificate: The Complete Guide

Every website running HTTPS has an SSL/TLS certificate. That certificate encrypts data between the browser and server, authenticates the site's identity, and ensures data integrity during transmission. When a certificate is misconfigured, expired, or using weak protocols, visitors see security warnings and search engines penalize your rankings.

Knowing how to check an SSL certificate is a fundamental skill for anyone managing websites, APIs, or online infrastructure.

## Quick Check: Use the Free SSL Checker

The fastest way to check any SSL certificate is with our [free SSL checker tool](/tools/ssl-checker). Enter any URL and get instant results including:

- Certificate validity and expiration date
- TLS protocol version
- Issuer and subject details
- Security grade breakdown
- Certificate chain validation

No signup required. Results in seconds.

## Method 1: Check SSL in Your Browser

Every modern browser lets you inspect a site's certificate directly.

### Chrome

1. Click the padlock (or "Not secure") icon in the address bar
2. Click "Connection is secure"
3. Click "Certificate is valid"
4. Review the certificate details: issuer, validity period, and subject

### Firefox

1. Click the padlock icon
2. Click the arrow next to "Connection secure"
3. Click "More Information"
4. Click "View Certificate" for full details

### Safari

1. Click the padlock icon in the address bar
2. Click "Show Certificate"
3. Expand sections to see issuer, validity, and fingerprints

Browser checks are convenient but limited. They only show the certificate for the page you're currently viewing, and they don't provide a security grade or flag potential misconfigurations.

## Method 2: Command Line with OpenSSL

For developers and sysadmins, OpenSSL provides the most detailed certificate inspection.

```bash
openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -dates -subject -issuer
```

This returns:
- **notBefore**: When the certificate was issued
- **notAfter**: When it expires
- **subject**: The domain(s) the certificate covers
- **issuer**: The certificate authority that issued it

To check the full certificate chain:

```bash
openssl s_client -connect example.com:443 -servername example.com -showcerts
```

OpenSSL is powerful but requires command-line access and knowledge of the syntax. For quick checks across multiple domains, a web-based tool is more practical.

## Method 3: Online SSL Checker Tools

Online tools provide the easiest and most comprehensive checks. Our [free SSL checker](/tools/ssl-checker) gives you everything in one scan:

- **Expiration countdown**: Exactly how many days until the certificate expires
- **TLS version**: Whether you're running TLS 1.2, 1.3, or an outdated version
- **Issuer details**: Who issued the certificate (Let's Encrypt, DigiCert, etc.)
- **Security grade**: An overall assessment of your SSL configuration
- **Chain validation**: Whether intermediate certificates are properly installed

## What to Look For in SSL Certificate Results

### Expiration Date

The most common SSL failure is simply letting a certificate expire. Let's Encrypt certificates are valid for 90 days. Commercial certificates last 1-2 years. Check the expiration date and set up monitoring well before it runs out.

### TLS Version

TLS 1.3 is the current standard. TLS 1.2 is still acceptable. Anything older (TLS 1.0, 1.1, SSL 3.0) is deprecated and insecure. If your server supports outdated protocols, attackers can force a downgrade attack.

### Certificate Chain

A valid certificate chain means the server presents its leaf certificate, any intermediate certificates, and can trace back to a trusted root certificate authority. Missing intermediates cause errors on some devices but not others, making them tricky to diagnose.

### Subject Alternative Names (SANs)

SANs list all domains a certificate covers. A certificate for `example.com` might also cover `www.example.com`, `api.example.com`, and `mail.example.com`. If you add a new subdomain, make sure your certificate's SANs include it.

### Key Size

RSA keys should be 2048 bits minimum (4096 is better). ECDSA keys should be 256 bits or larger. Keys smaller than these thresholds are considered weak.

## Common SSL Certificate Problems

### Expired Certificate

The most frequent issue. Browsers show full-page warnings, search rankings drop, and API integrations break. Use our [SSL checker](/tools/ssl-checker) to see exactly when your certificate expires, then set up automated monitoring to prevent surprises.

### Mismatched Domain Name

The certificate's Common Name or SANs don't match the domain being accessed. This happens when you access a site via a subdomain that isn't covered by the certificate, or when you've moved to a new domain without updating the certificate.

### Incomplete Certificate Chain

The server presents the leaf certificate but omits intermediate certificates. Most desktop browsers can fetch missing intermediates automatically, but mobile browsers and API clients often can't. This results in the certificate working on your laptop but failing on phones or in automated systems.

### Mixed Content

The page loads over HTTPS but includes resources (images, scripts, stylesheets) over HTTP. Browsers block or warn about mixed content, breaking page functionality.

### Self-Signed Certificates

Certificates not issued by a trusted certificate authority trigger browser warnings. Self-signed certificates are fine for development and internal tools, but production sites need certificates from recognized CAs.

## Checking SSL for APIs and Non-Browser Endpoints

API endpoints need the same certificate validation as websites, but you can't check them with a browser. Use the [free SSL checker](/tools/ssl-checker) or OpenSSL commands to verify:

- The certificate covers the API's domain
- The certificate chain is complete
- TLS 1.2+ is enforced
- The certificate isn't close to expiration

API certificate failures are particularly dangerous because they cause silent failures. Unlike websites where users see a warning, API clients typically receive connection errors with no clear explanation.

## Setting Up Ongoing SSL Monitoring

Checking certificates manually is useful for diagnosis, but ongoing monitoring prevents problems before they occur. With exit1.dev, you get:

- Automatic SSL certificate monitoring for every URL you track
- Expiration alerts at 30, 14, 7, and 1 day before expiry
- Multi-channel notifications via email, Slack, Discord, or webhooks
- 10 monitors on the free tier with 5-minute checks (Nano tier: unlimited monitors, 1-minute checks, $3/month)

Start with a quick check using the [SSL checker tool](/tools/ssl-checker), then set up continuous monitoring at [exit1.dev](https://app.exit1.dev) for ongoing protection.

## SSL Certificate Checklist

Before you move on, verify these essentials:

- [ ] Certificate is valid and not expired
- [ ] TLS 1.2 or 1.3 is enforced
- [ ] Certificate chain is complete (no missing intermediates)
- [ ] SANs cover all required domains and subdomains
- [ ] Key size meets minimum requirements (RSA 2048+, ECDSA 256+)
- [ ] HSTS header is configured
- [ ] No mixed content on any page
- [ ] Automated monitoring is in place

---

## Recommended Resources

- [Free SSL Checker Tool](/tools/ssl-checker) – Check any website's SSL certificate instantly
- [Free SSL Certificate Monitoring](/blog/free-ssl-certificate-monitoring) – Set up automated SSL monitoring
- [SSL Certificate Expiration: The Other Deadline](/blog/ssl-certificate-expiration-other-deadline) – Why SSL expiry deserves the same attention as domain expiry
- [Free SSL Monitoring with Slack Alerts](/blog/free-ssl-monitoring-slack-alerts) – Get SSL alerts in your team chat
