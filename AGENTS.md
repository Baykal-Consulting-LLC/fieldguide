# Project-wide engineering defaults

These defaults apply to all sessions working in this project and its prototype
directories. Keep the existing research, privacy, assessment, and coordination
safeguards below and in each repository's instructions; these defaults do not
weaken them.

1. Prefer the smallest clear solution that addresses an observed problem. Avoid
   speculative complexity; seek clarification only for material scope or behavior
   changes that are not already authorized.
2. Validate external inputs at trust boundaries. Use validated internal
   representations and avoid redundant defensive checks.
3. Keep one-time logic local unless extraction improves readability,
   responsibility, reuse, or testing. Handle errors deliberately; never silently
   hide failures.
4. Organize functions around coherent responsibilities. Avoid unnecessary
   fragmentation and abstraction.
5. Keep interfaces concise, readable, and accessible. Preserve essential labels
   and decision-relevant explanations; solve layout problems through layout.
6. Verify changes with proportionate tests. Preserve established behavior unless
   a change is intentional, and report material regressions, limitations, and
   tradeoffs.
7. Keep changes within the authorized scope and respect other sessions'
   ownership. Do not overwrite unrelated work.

# Fieldguide parallel prototypes

Read `shared-foundation/COORDINATION.md` before cross-approach or common-data work.

- `site/` is Approach 1: Career Explorer. `approach-2/` is Approach 2: College Pathways. They are separate repositories, Sites, builds and storage. Respect each repository's AGENTS.md and the other session's ownership.
- `shared-foundation/` is the only canonical source for promoted public common assets and updater tooling. Consumer copies are generated and locked. Do not manually duplicate a common fix or use runtime imports/symlinks into the sibling.
- App-specific work stays in the owning app. Common updates use one coordinating agent and the immutable release/plan/adopt workflow, compatibility checks, and existing per-app build/regression requirements. That agent handles both consumers; the user does not maintain common files twice.
- Keep credentials, accounts, real student records, owner-only profiles, frozen outcome histories and publication settings out of shared releases. Preserve official assessment wording, scoring, licensing and unknown answers.
- Do not run an update while either app has a build lease, or run app builds during a shared-update lease. Never clear an active session's lease. No common command deploys either Site.
