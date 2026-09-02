# Security Policies and Threat Mitigation

Rentra is built with security at the forefront, implementing robust defenses against common OWASP vulnerabilities.

## 1. Authentication & Authorization (RBAC)
- **JWT (JSON Web Tokens):** All API endpoints (except public catalogs) require a valid JWT passed via the `Authorization: Bearer` header.
- **Role-Based Access Control (RBAC):** Users are strictly mapped to `CUSTOMER`, `OWNER`, or `ADMIN`. The `auth.middleware.js` explicitly intercepts and drops requests if a user attempts to access an endpoint outside their permission scope (e.g., a Customer trying to approve a business registration).
- **Password Hashing:** Passwords are never stored in plaintext. We utilize `bcryptjs` with a high salt round value to defend against rainbow table attacks.

## 2. Network & Injection Defenses
- **Helmet.js:** Express headers are locked down using `helmet` to prevent Cross-Site Scripting (XSS), Clickjacking, and MIME-sniffing.
- **CORS Policies:** Cross-Origin Resource Sharing is strictly limited to authorized client domains. Unknown origins are actively blocked.
- **Rate Limiting:** A custom algorithmic rate limiter intercepts incoming requests to mitigate DDoS attacks and brute-force login attempts, gracefully handling traffic spikes.
- **NoSQL Injection Prevention:** Mongoose ODM is configured with strict schemas. Incoming JSON payloads are cast safely, preventing malicious query injection (`$gt`, `$ne`).

## 3. Media Security
- All KYC and Equipment images are securely uploaded to **Cloudinary** using an authenticated backend pipe. Files are processed entirely in memory buffers (`multer.memoryStorage()`) so malicious executable files are never written to the host filesystem.

## 4. Payment Integrity
- Deposit amounts and Platform fees are completely decoupled from the frontend. The backend mathematically calculates these values natively during the booking process, preventing users from modifying payment totals via client-side manipulation.
