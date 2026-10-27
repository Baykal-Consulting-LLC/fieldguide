# Approach 2: College Pathways

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
