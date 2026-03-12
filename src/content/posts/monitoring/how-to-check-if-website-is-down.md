---
title: "How to Check If a Website or API Is Down Right Now"
author: "Exit1 Team"
date: "2026-03-12"
category: "monitoring"
excerpt: "Is a website actually down or is it just you? Learn how to check website and API status, diagnose outages, and set up alerts so you know before your users do."
readTime: "6 min read"
metaDescription: "How to check if a website or API is down: free tools to verify outages, check HTTP status codes, inspect security headers, and diagnose server issues instantly."
---

# How to Check If a Website or API Is Down Right Now

Something isn't loading. Is the site actually down, or is it your connection? Is the API returning errors, or is your client misconfigured?

Before you start debugging your own setup, verify the problem with an independent check.

## Quick Answer: Use the Free API Status Checker

Our [free API status checker](/tools/api-status-checker) lets you check any URL instantly. Enter the address and get:

- **HTTP status code** (200, 301, 403, 500, etc.)
- **Response time** in milliseconds
- **Security headers** audit
- **CORS configuration** check
- **Redirect chain** analysis

If the tool returns a 200 with fast response time, the site is up and the problem is on your end. If it returns a 5xx error or times out, the site is genuinely down.

## Understanding HTTP Status Codes

The status code tells you exactly what's happening:

### Success (2xx)
- **200 OK**: Everything works. The server responded successfully.
- **201 Created**: The resource was created (common for POST requests).
- **204 No Content**: Success, but nothing to return (common for DELETE requests).

### Redirects (3xx)
- **301 Moved Permanently**: The URL has permanently moved. Update your bookmarks.
- **302 Found**: Temporary redirect. The original URL is still valid.
- **307/308**: Temporary/permanent redirect preserving the HTTP method.

### Client Errors (4xx)
- **400 Bad Request**: Your request is malformed.
- **401 Unauthorized**: Authentication required.
- **403 Forbidden**: You don't have permission.
- **404 Not Found**: The page doesn't exist.
- **429 Too Many Requests**: You've been rate-limited.

### Server Errors (5xx)
- **500 Internal Server Error**: Something broke on the server.
- **502 Bad Gateway**: A proxy or load balancer can't reach the backend.
- **503 Service Unavailable**: The server is overloaded or in maintenance.
- **504 Gateway Timeout**: The backend didn't respond in time.

The [API status checker](/tools/api-status-checker) shows you which code the server returns, so you can quickly determine whether the problem is client-side or server-side.

## Checking Website Status Step by Step

### Step 1: Check from an independent source

Don't rely on your own browser. Your local DNS cache, corporate proxy, or ISP could be the problem. Use the [API status checker](/tools/api-status-checker) to test from an external location.

### Step 2: Check DNS resolution

If the status checker can't reach the site at all, DNS might be the issue. Run:

```bash
nslookup example.com
dig example.com
```

If DNS isn't resolving, check with the [domain expiration checker](/tools/domain-expiration-checker) — the domain might have expired.

### Step 3: Test connectivity

Use the [free ping test](/tools/ping-test) to check if the server is reachable at the network level. If ping succeeds but HTTP fails, the problem is the application, not the network.

### Step 4: Check SSL

If the site loads over HTTP but not HTTPS, the SSL certificate might be the issue. Run the [SSL checker](/tools/ssl-checker) to verify certificate validity.

## Checking API Endpoint Health

APIs require more thorough checking than websites because failures are often partial — some endpoints work while others don't.

### What to verify

1. **Status code**: Is the API returning 200 or an error?
2. **Response time**: Is it responding within acceptable latency?
3. **Response body**: Is the API returning valid data or error messages?
4. **Security headers**: Are CORS, CSP, and other security headers properly configured?
5. **Redirect chain**: Is the API redirecting requests unexpectedly?

The [API status checker](/tools/api-status-checker) tests all of these in a single scan.

### Testing authenticated endpoints

For endpoints that require authentication, you'll need to use curl or Postman:

```bash
curl -I -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/v1/health
```

For public health check endpoints, the free status checker works perfectly.

## Security Headers: Why They Matter

The [API status checker](/tools/api-status-checker) also audits your security headers. Here's what to look for:

- **Strict-Transport-Security (HSTS)**: Forces HTTPS connections
- **Content-Security-Policy (CSP)**: Prevents XSS attacks
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **Referrer-Policy**: Controls referrer information leakage

Missing security headers don't cause downtime, but they leave your site vulnerable to attacks that eventually will.

## When It's Down: Immediate Actions

If you've confirmed the site is genuinely down:

1. **Check your hosting provider's status page** for known incidents
2. **Check server logs** for error messages
3. **Restart services** if you have server access
4. **Check recent deployments** — a bad deploy is the most common cause
5. **Monitor DNS and SSL** — sometimes the website is fine but DNS or certificates are broken

## Setting Up Proactive Monitoring

Checking whether a site is down after users complain is reactive. Setting up monitoring so you know before users do is proactive.

Exit1.dev monitors your endpoints continuously:

- HTTP, HTTPS, API, and ICMP checks from multiple global regions
- Response time tracking with historical data
- Security header auditing
- SSL certificate monitoring
- Multi-channel alerts via email, Slack, Discord, webhooks, and SMS

Start with a quick check using the [API status checker](/tools/api-status-checker), then set up continuous monitoring at [exit1.dev](https://app.exit1.dev) for free.

---

## Recommended Resources

- [Free API Status Checker](/tools/api-status-checker) – Check any URL's status, response time, and security headers
- [Free Ping Test](/tools/ping-test) – Test network connectivity and latency
- [Free SSL Checker](/tools/ssl-checker) – Verify SSL certificate validity
- [Free Domain Expiration Checker](/tools/domain-expiration-checker) – Make sure your domain hasn't expired
- [API Endpoint Monitoring Playbook 2025](/blog/api-endpoint-monitoring-playbook-2025) – Build a comprehensive API monitoring strategy
