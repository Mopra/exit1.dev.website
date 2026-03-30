---
title: "SSL Certificate Errors Explained: What They Mean and How to Fix Them"
author: "Exit1 Team"
date: "2026-03-11"
category: "monitoring"
excerpt: "Understand every SSL certificate error your browser can throw. Learn what causes each error, how to diagnose it, and how to fix it fast."
readTime: "8 min read"
metaDescription: "SSL certificate errors explained: what causes browser security warnings, how to diagnose certificate problems, and step-by-step fixes for every common SSL error."
---

# SSL Certificate Errors Explained: What They Mean and How to Fix Them

When a browser shows an SSL certificate error, most people panic. The red warnings look alarming, and the technical jargon doesn't help. But every SSL error has a specific cause and a clear fix.

This guide covers every common SSL certificate error, what triggers it, and exactly how to resolve it.

## Start With a Diagnostic Scan

Before troubleshooting blindly, run your domain through the [free SSL checker tool](/tools/ssl-checker). It will show you exactly what's wrong: expired certificates, TLS version issues, chain problems, and security misconfigurations. This saves you from guessing.

## ERR_CERT_DATE_INVALID (Expired Certificate)

**What you see**: "Your connection is not private" with the error code NET::ERR_CERT_DATE_INVALID.

**What it means**: The server's SSL certificate has either expired or isn't valid yet (the "not before" date is in the future).

**Common causes**:
- Certificate wasn't renewed before expiration
- Auto-renewal failed silently (payment method expired, ACME challenge failed)
- Server clock is wrong, making a valid certificate appear invalid
- Certificate was issued with incorrect validity dates

**How to fix it**:
1. Check the certificate's expiration date using the [SSL checker](/tools/ssl-checker)
2. If expired, renew immediately through your certificate authority or run `certbot renew --force-renewal` for Let's Encrypt
3. Install the new certificate and reload your web server
4. If the certificate is valid but the server clock is wrong, sync NTP: `sudo timedatectl set-ntp true`

**Prevention**: Set up SSL monitoring with alerts at 30, 14, and 7 days before expiration.

## ERR_CERT_COMMON_NAME_INVALID (Domain Mismatch)

**What you see**: "Your connection is not private" with NET::ERR_CERT_COMMON_NAME_INVALID.

**What it means**: The domain in the browser doesn't match any domain listed in the certificate's Common Name or Subject Alternative Names.

**Common causes**:
- Accessing `www.example.com` but the certificate only covers `example.com`
- New subdomain added without updating the certificate
- Domain was changed but certificate wasn't reissued
- Wildcard certificate (`*.example.com`) doesn't cover the apex domain (`example.com`)

**How to fix it**:
1. Check which domains the certificate covers using the [SSL checker](/tools/ssl-checker) — look at the Subject Alternative Names field
2. If your domain isn't listed, reissue the certificate to include it
3. For Let's Encrypt: `certbot certonly -d example.com -d www.example.com -d api.example.com`
4. For wildcard coverage: `certbot certonly -d example.com -d *.example.com`

## ERR_CERT_AUTHORITY_INVALID (Untrusted Certificate)

**What you see**: "Your connection is not private" with NET::ERR_CERT_AUTHORITY_INVALID.

**What it means**: The browser can't verify the certificate chain back to a trusted root certificate authority.

**Common causes**:
- Self-signed certificate used in production
- Missing intermediate certificates on the server
- Certificate issued by an internal/private CA that browsers don't trust
- Root CA has been distrusted (rare but it happens)

**How to fix it**:
1. If using a self-signed certificate in production, get a real certificate from Let's Encrypt (free) or a commercial CA
2. If intermediate certificates are missing, download the full chain from your CA and install it
3. For Nginx: combine certificates into one file: `cat cert.pem chain.pem > fullchain.pem`
4. For Apache: use the `SSLCertificateChainFile` directive

## ERR_SSL_PROTOCOL_ERROR

**What you see**: "This site can't provide a secure connection" with ERR_SSL_PROTOCOL_ERROR.

**What it means**: The browser and server couldn't agree on an SSL/TLS protocol version.

**Common causes**:
- Server only supports deprecated protocols (SSL 3.0, TLS 1.0, TLS 1.1) that the browser has disabled
- Server SSL configuration is corrupted
- Firewall or proxy is interfering with the TLS handshake
- Server is not actually running HTTPS on the expected port

**How to fix it**:
1. Enable TLS 1.2 and TLS 1.3 on your server
2. For Nginx: `ssl_protocols TLSv1.2 TLSv1.3;`
3. For Apache: `SSLProtocol -all +TLSv1.2 +TLSv1.3`
4. Verify the fix with the [SSL checker](/tools/ssl-checker) — it shows which TLS versions your server supports

## ERR_SSL_VERSION_OR_CIPHER_MISMATCH

**What you see**: "This site can't provide a secure connection" with ERR_SSL_VERSION_OR_CIPHER_MISMATCH.

**What it means**: The browser and server have no compatible cipher suites or TLS versions in common.

**Common causes**:
- Server configured with only weak or outdated cipher suites
- Certificate uses an algorithm the browser doesn't support
- Misconfigured cipher suite ordering

**How to fix it**:
1. Use Mozilla's SSL Configuration Generator to get recommended cipher suites for your server
2. Ensure your certificate uses RSA 2048+ or ECDSA 256+ keys
3. Test after changes with the [SSL checker](/tools/ssl-checker) to confirm compatibility

## Mixed Content Warnings

**What you see**: Padlock icon shows a warning triangle, or resources fail to load.

**What it means**: The page loads over HTTPS but includes resources (images, scripts, CSS) loaded over HTTP.

**Common causes**:
- Hardcoded `http://` URLs in page templates
- Third-party scripts loaded over HTTP
- CMS or asset pipeline not configured for HTTPS
- Database contains HTTP URLs from before HTTPS migration

**How to fix it**:
1. Find mixed content resources in browser DevTools (Console tab shows warnings)
2. Update URLs to use HTTPS or protocol-relative (`//`) format
3. Add Content-Security-Policy header: `Content-Security-Policy: upgrade-insecure-requests`
4. For CMS platforms, run a search-and-replace on the database to update `http://` to `https://`

## HSTS-Related Errors

**What you see**: "You cannot visit example.com right now" with no option to proceed.

**What it means**: The site previously sent an HSTS (HTTP Strict Transport Security) header telling the browser to only connect via HTTPS. Now HTTPS is broken, and the browser won't allow an insecure fallback.

**Common causes**:
- Certificate expired on a site with HSTS enabled
- HSTS max-age set too long on a site that later needed HTTP access
- SSL misconfiguration on an HSTS-protected domain

**How to fix it**:
1. Fix the SSL certificate issue first (the underlying problem)
2. HSTS errors resolve automatically once HTTPS is working again
3. For testing only (not production), clear HSTS state in Chrome: `chrome://net-internals/#hsts`

**Prevention**: Always test certificate renewals before HSTS max-age expires.

## Certificate Transparency Errors

**What you see**: ERR_CERTIFICATE_TRANSPARENCY_REQUIRED

**What it means**: The certificate wasn't logged to Certificate Transparency logs, which modern browsers require.

**How to fix it**: Reissue the certificate from a CA that supports Certificate Transparency (all major CAs do). Let's Encrypt certificates include CT logs automatically.

## Diagnosing SSL Errors Systematically

When you encounter any SSL error, follow this process:

1. **Scan first**: Run the domain through the [SSL checker tool](/tools/ssl-checker) to get a complete picture
2. **Check the basics**: Is the certificate expired? Does it cover the right domain?
3. **Verify the chain**: Are intermediate certificates installed?
4. **Test protocols**: Is the server offering TLS 1.2+ with modern cipher suites?
5. **Check from multiple locations**: An error that appears only in some locations may indicate a CDN or proxy issue

## Preventing SSL Errors Before They Happen

The best SSL error is one that never reaches your users.

- **Monitor all certificates** with [exit1.dev](https://app.exit1.dev) — 10 free monitors with 5-minute checks and multi-channel alerts (upgrade to Nano for unlimited monitors and 1-minute checks at $3/month)
- **Automate renewals** using Let's Encrypt and certbot, or CDN-managed certificates
- **Test after changes** using the [SSL checker](/tools/ssl-checker) whenever you modify server configuration
- **Use HSTS carefully** — start with a short max-age and increase only after confirming HTTPS is stable

---

## Recommended Resources

- [Free SSL Checker Tool](/tools/ssl-checker) – Diagnose any SSL certificate issue instantly
- [How to Check an SSL Certificate](/blog/how-to-check-ssl-certificate) – Complete guide to SSL certificate inspection
- [Free SSL Certificate Monitoring](/blog/free-ssl-certificate-monitoring) – Automated SSL monitoring setup
- [SSL Certificate Expiration: The Other Deadline](/blog/ssl-certificate-expiration-other-deadline) – Why certificate expiry is as dangerous as domain expiry
