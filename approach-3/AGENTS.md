# Approach 3: Routes and careers

This is an independently owned experimental prototype. Never edit, build,
deploy, reset, or import live runtime files/state from `site/`, `approach-2/`,
or their results boards. Work from the recorded public resource snapshot.

- Lifestyle precedes the official 60-item interest profiler. Wording, response
  scale, scoring and attribution are unchanged. Up to 24 adaptive career
  follow-ups form the first matching round; optional subject/planning questions
  after results are counted separately.
- Career support comes only from the preserved Approach 1 evidence engine.
  A pathway/program connection cannot promote a career to Strong match.
  Unknown interests stay unknown; no text or demographic shortcuts.
- Use exact occupational codes and explicit CIP links, never title similarity,
  to connect careers and programs. Keep broad pathway connections distinct
  from individually supported careers and institution-specific programs.
- Show no-degree, training, associate, bachelor and graduate alternatives, and
  preserve career/route deduplication, earnings provenance, preparation stages,
  proxy labels and the distinction between qualified pay and training pay.
- New Site identity and `fieldguide:approach-3:v1` storage only. Do not copy
  accounts, student drafts, databases, event logs, owner-only profiles,
  credentials or original publication settings.
- Private research and frozen outcome ledgers stay outside `dist/` and public
  common releases. Do not call synthetic preservation checks accuracy evidence.
- Run resource verification, shared checks, compatibility tests and build
  before publishing. Do not edit generated upstream snapshots by hand.

<!-- FIELDGUIDE SHARED RULES START -->
## Shared foundation and parallel development — mandatory

- This repository is identified by its local `shared-foundation.lock.json`. The sibling app is independently owned by its session. Do not edit, build, deploy, reset, or clean the sibling repository as part of app-specific work.
- Read `SHARED-FOUNDATION.md` and `shared-foundation.lock.json` before changing shared data, assessment/scoring, source caches, build scripts, or integration tooling. Read `../shared-foundation/COORDINATION.md` when available; the local contract remains sufficient for a standalone checkout.
- Files listed in the lock's `mapping` are generated, pinned shared assets. Never edit them directly or copy ad hoc from the sibling. Propose common changes in `../shared-foundation/source/` (updater in `../shared-foundation/tools/manage.py`), create a NEW immutable release, then use its `plan`/`adopt --app both` workflow. Keep official wording, response scale, scoring, attribution and source suppression flags intact.
- Run `npm run shared:check` before and after relevant work. Normal npm build commands use the app-local `scripts/shared-foundation.py run` lease wrapper. Use that wrapper for direct generator/build commands too. Do not bypass an active shared-update/build lease; coordinate with the other session. A stale lease requires verifying the owning PID is no longer active before removal.
- Keep matching/ranking policy, pathway grouping, UX, student plans, credentials, hosting identity and generated model results app-owned. No live sibling imports, shared student storage, forced matching, silent upgrades or automatic publishing from the common updater.
- A common update is the coordinating agent's responsibility: preflight BOTH apps, run compatibility checks, regenerate affected app-owned projections, and run their required regression/build checks before either publication. The user should not repeat common edits or coordinate file maintenance manually. Do not overwrite frozen cohorts or historical baselines when refreshing data.
- The historical separation snapshot is historical evidence, NOT a permanent freeze. The ongoing guard checks local pins and runtime boundaries, permitting independent sibling development. It is a consistency guard, not an OS security sandbox or proof attributing concurrent filesystem edits.
<!-- FIELDGUIDE SHARED RULES END -->
