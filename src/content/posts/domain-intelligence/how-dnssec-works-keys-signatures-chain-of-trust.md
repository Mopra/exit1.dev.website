---
title: "How DNSSEC Actually Works: Keys, Signatures, and the Chain of Trust"
author: "Exit1 Team"
date: "2026-01-20"
category: "domain-intelligence"
excerpt: "Ready for the technical deep dive? Here's how DNSSEC cryptography works, from ZSK to DS records to the validation chain."
readTime: "12 min read"
metaDescription: "Technical deep dive into DNSSEC architecture. Understand KSK, ZSK, DS records, RRSIG, DNSKEY, and how the chain of trust validates DNS responses."
---

# How DNSSEC Actually Works: Keys, Signatures, and the Chain of Trust

The simple explanation of DNSSEC is "it signs DNS records." The reality is more complex and more interesting.

This is the technical deep dive: key types, record types, the signing process, the validation chain, and how it all fits together.

## The Cryptographic Foundation

DNSSEC uses public key cryptography:
- **Private key**: Signs records (kept secret)
- **Public key**: Verifies signatures (published in DNS)

If you can verify a signature with the public key, you know the private key holder created it.

### Algorithm Support

DNSSEC supports multiple algorithms:

| Algorithm | Number | Status | Recommended |
|-----------|--------|--------|-------------|
| RSA/SHA-256 | 8 | Active | Yes |
| RSA/SHA-512 | 10 | Active | Yes |
| ECDSA P-256/SHA-256 | 13 | Active | Yes (smaller) |
| ECDSA P-384/SHA-384 | 14 | Active | Yes |
| Ed25519 | 15 | Active | Yes (newest) |
| RSA/SHA-1 | 5 | Deprecated | No |
| DSA | 3 | Deprecated | No |

Modern deployments typically use Algorithm 13 (ECDSA P-256) for smaller key/signature sizes, or Algorithm 8 (RSA/SHA-256) for wider compatibility.

## The Key Hierarchy

DNSSEC uses two types of keys per zone:

### Zone Signing Key (ZSK)

**Purpose:** Signs the actual DNS records in your zone

**Characteristics:**
- Smaller key size (1024-2048 bits RSA, or 256-bit ECDSA)
- Rotated frequently (every 1-3 months)
- Used constantly for signing
- Compromise is bad but recoverable

**Why separate?**
- Frequent rotation limits exposure
- Smaller keys = smaller signatures = faster DNS
- Can rotate without coordinating with parent zone

### Key Signing Key (KSK)

**Purpose:** Signs the DNSKEY record (which contains the ZSK)

**Characteristics:**
- Larger key size (2048-4096 bits RSA, or 384-bit ECDSA)
- Rotated infrequently (every 1-2 years)
- Used only to sign DNSKEY record
- Compromise is severe

**Why separate?**
- Longer validity reduces DS record updates
- Higher security for the trust anchor
- Less frequent rotation = less coordination

### The Key Relationship

```
KSK (Key Signing Key)
  |
  +-- signs --> DNSKEY record (contains both KSK and ZSK public keys)
  
ZSK (Zone Signing Key)
  |
  +-- signs --> All other records (A, AAAA, MX, TXT, etc.)
```

## DNSSEC Record Types

DNSSEC introduces several new record types:

### DNSKEY Record

Contains the public keys for your zone:

```
example.com. 3600 IN DNSKEY 256 3 13 (
    oJMRESz5E4gYzS/q6XDrvU1qMPYIjCWzJaOau8XNEZeq
    HYRCIwLISNYp5bzMzB4TnWg8qPBszviqgMUCQ0U8CA==
)

example.com. 3600 IN DNSKEY 257 3 13 (
    mdsswUyr3DPW132mOi8V9xESWE8jTo0dxCjjnopKl+GqJ
    xpVXckHAeF+KkxLbxILfDLUT0rAK9iUzy1L53eKGQ==
)
```

**Flags:**
- `256` = Zone Signing Key (ZSK)
- `257` = Key Signing Key (KSK)

**Protocol:** Always `3` (DNSSEC)

**Algorithm:** `13` = ECDSA P-256

### RRSIG Record

Contains the signature for a record set:

```
example.com. 3600 IN A 93.184.216.34

example.com. 3600 IN RRSIG A 13 2 3600 (
    20250301000000 20250201000000 12345 example.com.
    DuLKiXb8kkPQNp5Xm3/8w0S3Fv2sB1KxE9...
)
```

**Fields:**
- `A` = Type of record being signed
- `13` = Algorithm
- `2` = Labels (number of labels in owner name)
- `3600` = Original TTL
- `20250301000000` = Signature expiration
- `20250201000000` = Signature inception
- `12345` = Key tag (identifies which DNSKEY signed this)
- `example.com.` = Signer name
- `DuLKiXb8...` = The actual signature

### DS Record

Delegation Signer record, published in parent zone:

```
; In the .com zone:
example.com. 3600 IN DS 12345 13 2 (
    E2D3C916F6DEEAC73294E8268FB5885044A833FC5459588F4A9184CFC41A5766
)
```

**Fields:**
- `12345` = Key tag of the DNSKEY this refers to
- `13` = Algorithm
- `2` = Digest type (2 = SHA-256)
- `E2D3C916...` = Hash of the DNSKEY record

**Purpose:** Links child zone to parent zone, creating chain of trust.

### NSEC/NSEC3 Records

Prove non-existence of records:

```
; "There is no www.example.com"
example.com. 3600 IN NSEC mail.example.com. A RRSIG NSEC
```

**NSEC:** Simple but reveals all domain names (zone walking)
**NSEC3:** Hashed names, prevents zone enumeration

## The Chain of Trust

DNSSEC validation requires a chain from root to your domain:

### The Root

The root zone is signed by ICANN:
- Root KSK is the ultimate trust anchor
- Published and distributed to resolvers
- Resolvers trust the root KSK by configuration

### TLD Level

The root signs DS records for TLDs:

```
; In root zone:
com. 172800 IN DS 30909 8 2 (
    E2D3C916F6DEEAC73294E8268FB5885044A833FC5459588F4A9184CFC41A5766
)
```

This DS record links to .com's DNSKEY.

### Your Domain

The TLD signs DS records for your domain:

```
; In .com zone:
example.com. 86400 IN DS 12345 13 2 (
    A1B2C3D4E5F6...
)
```

This DS record links to your DNSKEY.

### Complete Chain

```
Root Zone
  |
  +-- DNSKEY (root's keys, trusted by configuration)
  |
  +-- DS (for .com, signed by root DNSKEY)
        |
        V
.com Zone
  |
  +-- DNSKEY (verified against DS in root)
  |
  +-- DS (for example.com, signed by .com DNSKEY)
        |
        V
example.com Zone
  |
  +-- DNSKEY (verified against DS in .com)
  |
  +-- A record + RRSIG (verified against example.com DNSKEY)
```

## The Signing Process

How a zone gets signed:

### 1. Generate Keys

```bash
# Generate KSK
dnssec-keygen -a ECDSAP256SHA256 -f KSK example.com

# Generate ZSK  
dnssec-keygen -a ECDSAP256SHA256 example.com
```

### 2. Sign the Zone

```bash
dnssec-signzone -o example.com -k Kexample.com.+013+12345 \
    example.com.zone Kexample.com.+013+67890
```

This creates:
- RRSIG records for all record sets
- NSEC/NSEC3 records for non-existence proofs
- Signed DNSKEY record

### 3. Publish DS Record

Extract DS record from signed DNSKEY:

```bash
dnssec-dsfromkey Kexample.com.+013+12345.key
```

Output:
```
example.com. IN DS 12345 13 2 A1B2C3D4E5F6...
```

This must be published in the parent zone (at your registrar).

### 4. Load Signed Zone

Replace unsigned zone with signed zone on authoritative servers.

## The Validation Process

When a resolver validates a DNSSEC response:

### Step 1: Query for Record

```
Query: example.com A
```

### Step 2: Receive Response

```
example.com. A 93.184.216.34
example.com. RRSIG A 13 2 3600 ...
```

### Step 3: Get DNSKEY

```
Query: example.com DNSKEY
Response: 
  example.com. DNSKEY 256 3 13 (ZSK public key)
  example.com. DNSKEY 257 3 13 (KSK public key)
  example.com. RRSIG DNSKEY 13 2 3600 ...
```

### Step 4: Verify A Record Signature

1. Find RRSIG for A record
2. Find DNSKEY matching key tag in RRSIG
3. Verify signature using DNSKEY public key
4. Check signature dates (not expired, not future)
5. If valid: A record is authenticated

### Step 5: Verify DNSKEY

1. Find RRSIG for DNSKEY record
2. Verify signature using KSK
3. Need to verify KSK is legitimate...

### Step 6: Get DS from Parent

```
Query to .com: example.com DS
Response:
  example.com. DS 12345 13 2 A1B2C3D4...
  example.com. RRSIG DS 13 2 86400 ...
```

### Step 7: Verify DS Matches DNSKEY

1. Hash the DNSKEY record
2. Compare to DS digest
3. If match: DNSKEY is authenticated by parent

### Step 8: Verify DS Signature

1. Get .com DNSKEY
2. Verify DS RRSIG
3. Get DS for .com from root
4. Continue up to root

### Step 9: Root Verification

1. Verify .com DS signature using root DNSKEY
2. Root DNSKEY is trusted (configured trust anchor)
3. Chain complete!

## Key Rollover

Keys must be rotated periodically. This is complex:

### ZSK Rollover (Pre-Publication)

1. Generate new ZSK
2. Publish both old and new DNSKEY (wait for TTL)
3. Start signing with new ZSK
4. Remove old DNSKEY (wait for TTL)
5. Delete old ZSK

Timeline: ~2-4 weeks

### KSK Rollover (Double-DS)

1. Generate new KSK
2. Publish new DNSKEY, sign with both KSKs
3. Add new DS to parent zone
4. Wait for DS propagation
5. Remove old DS from parent
6. Remove old KSK from zone
7. Delete old KSK

Timeline: ~4-8 weeks

**Why complex?**
- Resolvers cache records
- Must wait for old cached records to expire
- Premature removal = validation failures
- Wrong timing = outage

## Debugging DNSSEC

When things go wrong:

### Common Validation Errors

**SERVFAIL responses:**
- Signature expired
- Key mismatch
- Broken chain of trust
- Algorithm not supported

**Diagnosis tools:**

```bash
# Check DNSSEC status
dig +dnssec example.com

# Trace validation chain
delv example.com

# Visual analysis
# Use dnsviz.net
```

### What to Check

1. **Signature dates:** Not expired? Not future?
2. **DS record:** Matches current KSK?
3. **DNSKEY:** Both ZSK and KSK published?
4. **RRSIG:** For all record types?
5. **NSEC/NSEC3:** Properly configured?
6. **Algorithm:** Supported by resolvers?

## Implementation Options

### Option 1: Managed DNSSEC

Let your DNS provider handle everything:
- Cloudflare: One-click enable
- Route 53: One-click enable
- Google Cloud DNS: One-click enable

Provider handles:
- Key generation
- Signing
- Key rollover
- DS record publication (sometimes)

**Pros:** Simple, reliable
**Cons:** Less control, provider lock-in

### Option 2: Self-Managed with Automation

Use tools like:
- OpenDNSSEC
- BIND with inline signing
- PowerDNS with built-in DNSSEC

You handle:
- Key management
- Rollover scheduling
- DS record updates
- Monitoring

**Pros:** Full control
**Cons:** Complex, error-prone

### Option 3: HSM-Based

For high-security requirements:
- Keys stored in Hardware Security Module
- Never extracted in plaintext
- Signing operations happen in HSM

**Pros:** Maximum security
**Cons:** Expensive, complex

## The Bottom Line

DNSSEC is cryptographically sound but operationally complex:

- **Signing:** Straightforward with right tools
- **Key management:** Critical and error-prone
- **Validation:** Happens automatically at resolvers
- **Debugging:** Requires specialized knowledge

For most organizations, managed DNSSEC through a major DNS provider is the right choice. The cryptography is the same; the operational burden is not.

If you self-manage, automation is essential. Manual key rollover is a recipe for outages.

---

## Recommended Reading

- [DNSSEC Explained](/blog/dnssec-explained-what-it-is-why-you-need-it) - Beginner introduction
- [Common DNSSEC Misconfigurations](/blog/dnssec-misconfigurations-detection-guide) - What goes wrong
- [DNSSEC Rollover Failures](/blog/dnssec-rollover-failures-case-studies) - Learning from disasters
