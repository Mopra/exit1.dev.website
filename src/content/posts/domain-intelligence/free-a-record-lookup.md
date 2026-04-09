---
title: "Free A Record Lookup — Find the IP Address of Any Domain"
author: "Morten Pradsgaard"
date: "2026-04-09"
category: "domain-intelligence"
excerpt: "Look up A records to find any domain's IPv4 address."
readTime: "5 min read"
metaDescription: "Free A record lookup tool. Find the IPv4 address of any domain, check TTL values, and troubleshoot DNS resolution. No signup required."
---

# Free A Record Lookup — Find the IP Address of Any Domain

*The A record is the most fundamental DNS record. It maps a human-readable domain name to the IPv4 address where your server actually lives. No A record, no website.*

**Check A records now:** Our [free DNS Lookup Tool](/tools/dns-checker) shows A records with TTL values, plus AAAA (IPv6), CNAME, and all other record types.

## What Is an A Record?

An A (Address) record maps a domain name to a 32-bit IPv4 address. When someone types `example.com` in their browser, the DNS resolver looks up the A record to find the IP address to connect to.

**Example:**
```
example.com.    300    IN    A    93.184.216.34
```

- `example.com.` — The domain
- `300` — TTL in seconds (5 minutes)
- `A` — Record type
- `93.184.216.34` — The IPv4 address

A domain can have multiple A records. DNS returns all of them and the client typically picks one (round-robin load balancing).

## How to Look Up A Records

### Method 1: DNS Lookup Tool

Enter any domain in our [DNS Lookup Tool](/tools/dns-checker). A records appear in the "Address Records" section with TTL values shown as human-readable durations (e.g., "5m" instead of "300").

### Method 2: Command line

```bash
# Simple lookup
dig example.com A +short
# Output: 93.184.216.34

# With full details (TTL, class, type)
dig example.com A

# Query a specific resolver
dig @8.8.8.8 example.com A +short
```

## What the TTL Tells You

The TTL (Time To Live) controls how long DNS resolvers cache the record before re-querying:

| TTL | Duration | What It Suggests |
|-----|----------|-----------------|
| 60 | 1 minute | Failover setup, or preparing for a DNS change |
| 300 | 5 minutes | Common for actively managed domains |
| 3600 | 1 hour | Standard default for stable records |
| 86400 | 24 hours | Rarely-changed records, static infrastructure |

**Planning a migration?** Lower your A record TTL to 60-300 at least 24 hours before the change. This ensures all resolvers have expired their cache of the old record by the time you switch IPs. See our [DNS propagation guide](/blog/dns-propagation-how-long-do-changes-take) for the full strategy.

## Multiple A Records

Many domains have multiple A records for load balancing or redundancy:

```bash
dig google.com A +short
# 142.250.80.46
# 142.250.80.78
# 142.250.80.110
# ...
```

DNS resolvers return all records and rotate the order. The client connects to the first one. If that server is down, the client may try the next (browser behavior varies).

This is the simplest form of load balancing but has no health checking — DNS doesn't know if a server is down. For proper failover, use a load balancer or a DNS provider with health checks.

## A Record vs AAAA vs CNAME

| Record | Points To | Use Case |
|--------|----------|----------|
| **A** | IPv4 address (e.g., `93.184.216.34`) | Direct IP mapping |
| **AAAA** | IPv6 address (e.g., `2606:2800:...`) | IPv6 connectivity |
| **CNAME** | Another hostname (e.g., `example.com`) | Alias to third-party service |

A domain can have both A and AAAA records (dual-stack). It cannot have a CNAME alongside A records at the same name.

## Troubleshooting A Record Issues

### Domain doesn't resolve

No A or AAAA record means the domain has no IP to connect to. Check if there's a CNAME that should chain to an A record, and whether the CNAME target resolves.

### Points to the wrong IP

After switching hosting providers, update your A record to the new server's IP. The old IP might serve someone else's site — or nothing at all. Use our [DNS Lookup Tool](/tools/dns-checker) to verify the current A record matches your actual server.

### Website loads but shows wrong content

The A record resolves to an IP, but that IP serves a different site (shared hosting, old server, or a CDN misconfiguration). Check which server is at that IP and verify your hosting configuration.

### Slow resolution

If your TTL is very high and you recently changed the record, some users may still see the old IP. Check what different resolvers return by querying Google (`8.8.8.8`), Cloudflare (`1.1.1.1`), and your ISP separately.

## Recommended Resources

- [Free DNS Lookup Tool](/tools/dns-checker) — Check A records, TTL, and all DNS record types
- [DNS Record Types Explained](/blog/dns-record-types-explained) — Complete reference for every record type
- [Free CNAME Lookup Tool](/blog/free-cname-lookup-tool) — Check CNAME aliases
- [DNS Propagation Guide](/blog/dns-propagation-how-long-do-changes-take) — How long IP changes take to propagate
- [How to Check DNS Records](/blog/how-to-check-dns-records) — Three free lookup methods
