# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x (latest) | ✅ Active |
| < 0.1.0 | ❌ Not supported |

We support the latest minor release on the `0.1.x` track. Security patches are released as patch versions (e.g. `0.1.5` → `0.1.6`).

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

If you discover a security issue in Veloria UI, report it privately so we can address it before public disclosure.

### How to report

1. **Email:** Send a report to the maintainer via the contact listed on [github.com/JohnDev19](https://github.com/JohnDev19).
2. **GitHub private disclosure:** Use [GitHub's private vulnerability reporting](https://github.com/JohnDev19/Veloria-UI/security/advisories/new) (Settings → Security → Advisories).

### What to include

- A description of the vulnerability and its potential impact.
- Steps to reproduce or a minimal proof-of-concept.
- The version(s) of Veloria UI affected.
- Any suggested mitigations, if you have them.

---

## Response Timeline

| Stage | Target |
|-------|--------|
| Acknowledgement | Within 48 hours |
| Initial assessment | Within 5 business days |
| Patch or mitigation | Within 14 days for critical issues, 30 days for others |
| Public disclosure | After patch is released and users have had time to update |

We will keep you informed throughout the process and credit you in the advisory unless you prefer to remain anonymous.

---

## Scope

Security issues we want to hear about:

- **CLI vulnerabilities** — arbitrary code execution, path traversal, unsafe shell injection via component names or config values.
- **Supply chain** — dependency confusion attacks, compromised dependencies.
- **`diff` command** — issues with the GitHub raw API fetch (e.g. SSRF via crafted config, unsafe URL construction).
- **XSS in components** — any component that renders user-supplied content unsafely via `dangerouslySetInnerHTML`.

Out of scope:

- Issues in `devDependencies` that do not affect the published package.
- Vulnerabilities in applications built *with* Veloria UI (that is your responsibility as the application author).
- Social engineering attacks.

---

## Security Best Practices for Users

- Always pin your Veloria UI version in `package.json` (`"veloria-ui": "0.1.5"`, not `"^0.1.5"`) if supply-chain integrity is a concern.
- Audit the source of any component you add via `veloria-ui add` before committing it to production. The file is copied into your repo — you can inspect it freely.
- If you use `veloria-ui diff` in CI, validate that the `upstreamUrl` in the JSON output matches the expected GitHub domain before acting on it.

---

## Acknowledgements

We appreciate the responsible disclosure of security issues. Reporters who follow this policy will be credited in the relevant GitHub Security Advisory.

---

*Last updated: 2026-03-17*