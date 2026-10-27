# Email sign-in and private saved guides

Release 0.29.0. Matching remains 3.2.0; questionnaire and scoring have not changed.

## Student experience

Use **Sign in**, or **My space → Sign in & save**. Enter an email, then the six-digit code. No password is requested. A new account explicitly chooses **Save this guide** or **Start a new guide**. Returning accounts load their own guide. The anonymous draft remains separate.

Changes autosave after one second; the footer distinguishes account saving, saved, offline, expired-session and conflicting-copy states. **My account** offers Save now, confirmed reload, sign-out, and separately confirmed deletion of saved results. Restart/restore preserves earlier guides within the account. Exports remain available.

The saved bundle includes the questionnaire, lifestyle, notes, career choices, action completion, education/money worksheets and earlier saved guides. Developer experiments remain isolated and are never uploaded by these controls.

## Data and access

Frontend: the existing public Sites website. Authentication: Neon Managed Better Auth, using the documented Email OTP SDK. Backend: authenticated Neon Function `studentguides`, project `autumn-moon-38916970`, production branch `br-withered-wave-b4pc4zkg`, database `fieldguide`.

`student_guides.user_id` comes exclusively from a verified Neon JWT, never a browser-supplied email/id. Every query includes that identity. Ed25519 signatures, issuer and expiration are checked before database access. Data responses are private/no-store. Browser origin is allowlisted; CORS is not the authorization mechanism. The database connection is injected only into the backend. No database URL, service credential, OTP or token belongs in source, downloads or browser configuration.

Saves use a monotonic revision. A stale write receives 409, preserving the account copy; the student explicitly chooses which copy to retain. Writes are serialized, and late responses from an earlier session cannot update the current account revision. Local caches and earlier-guide history are scoped by authenticated user id. Successful sign-out removes that user's device cache and restores the separate anonymous draft. Failed/unsynced saves prevent silent data loss on sign-out.

The server enforces an 8 MB request limit and a 100-guide bundle limit. Larger histories require export before further account saving. This is not an unlimited backup service. Cross-device availability requires a successful account save; offline changes remain device-local until reconnected and saved. Browser storage remains unencrypted by the application.

## Verification and remaining checks

- Full suite: 381 passing tests (360 existing, 21 new).
- Real deployed backend: two fictional QA accounts, isolated read/write, save/reload of notes and completed steps, stale-update rejection and forged-token rejection all passed.
- Synthetic signup tests used reserved example.com addresses, with verification disabled by the provider default; no email was sent. Two clearly labeled QA identities and one tiny synthetic guide were retained, not real student records.
- Browser: anonymous guide remains usable; email sign-in UI renders correctly and opens from the header.
- Email delivery, OTP entry, browser session restoration after actual OTP sign-in and sign-out are awaiting a consenting test recipient. API tests do not prove those browser/email flows.

## Email sender setup

The branch currently uses Neon's shared sender `auth@mail.myneon.app`. Neon documents this as development-only. A production SMTP provider/sender must be configured in **Neon Console → project → Auth settings → Email provider** before describing delivery as production-ready. Do not put SMTP credentials in this repository or a chat message. Configure them directly in Neon. After setup, verify a real code, refresh persistence, another device, sign-out and two student accounts.

Official references checked October 17, 2026:

- https://neon.com/docs/auth/guides/plugins/email-otp
- https://neon.com/docs/auth/production-checklist
- https://neon.com/docs/compute/functions/authentication

## Development

Install the locked dependencies with `npm ci`. Run `npm run build:account` after changing `backend/browser-client.js` or dependencies. This builds the browser SDK bundle and `.cache/account-function/index.mjs`. The bundled backend is deployed using Neon Functions; then publish the static frontend through Sites. `account-config.js` contains only public endpoint URLs.

`node scripts/verify-account-live.mjs` creates two additional fictional QA identities on every run; it is an opt-in live check, excluded from npm test. Do not run it as a recurring test or against an unrelated project. The ordinary test suite uses signed synthetic tokens and an in-memory repository and sends no email.

The Neon browser client explicitly includes credentials on cross-origin requests. Safari/ITP may block third-party auth cookies; this browser/device compatibility is not yet verified. If confirmed, the documented remedy is a same-origin auth proxy or shared-parent-domain auth deployment, rather than placing session tokens in browser storage.
