# Parallel development contract

## Ownership

| Component | Owner |
|---|---|
| `site/` app, profession matching, results board, calibration and dashboard | Approach 1 session |
| `approach-2/` app, college pathway grouping, ranking, study plan | Approach 2 session |
| `approach-3/` combined route/career prototype and its separate state | Approach 1/3 coordinating session |
| `shared-foundation/source/` public reference assets and `tools/manage.py` | One coordinating session per common update |

The Approach 2 session explicitly agreed to these boundaries. Both repositories carry mandatory AGENTS.md instructions and a local SHARED-FOUNDATION.md contract. This document does not freeze either app or give a session permission to rewrite its sibling's app-specific code.

Approach 3 is an independently registered experimental consumer. Its addition
does not upgrade either original app, change their public audience, import
their accounts/drafts, or merge their ranking policies. Its app-specific public
resource snapshots are generated and hash-locked; frozen results and private
research remain outside the common payload and student runtime. Only explicit
occupational/program codes establish resource links. A pathway connection is
not evidence for a career Strong match.

The original `--app both` alias continues to mean Approach 1 and Approach 2.
Use `--app approach3` to plan/adopt its pin, or `--app all` only when an update
to every registered consumer is authorized. Existing consumer pins and their
versioned local contracts remain valid. Tooling release 1.3.0 adds registry-based
consumer selection; its public reference data are unchanged from 1.2.0.

## What is shared

Official O*NET 31 reference CSV tables (all original rows, dates and suppression flags), the CIP crosswalk, the unchanged official interest module and question source, sourced wage/education references, provenance/licensing, and a versioned answer interchange contract. Initial assets come from the existing public source snapshots; no student records, browser data, accounts, credentials, Site configuration or preservation archives are included.

Sharing an input does not merge matching rules, promote careers, change pay assumptions, migrate a student's answers or imply that the two approaches should return identical results. Their occupation coverage and use of common inputs can intentionally differ. Any later account/plan transfer requires a reviewed adapter and explicit consent.

## Normal app work

1. Read the local contract and run `npm run shared:check`.
2. Edit the owning app only. Never edit paths listed in `shared-foundation.lock.json` directly.
3. Use ordinary npm build commands, which run through the local lease wrapper. For direct generators use `python3 scripts/shared-foundation.py run -- COMMAND ...`.
4. Run app checks and the local pin check before publication. Preserve each app's existing regression, privacy and publishing rules.

Each repository includes the immutable compressed package it pins and a generated local updater. It can check/build with the canonical workspace and sibling unavailable. There are no background version polls or silent upgrades.

## A common improvement, maintained once

From the parent workspace:

```sh
# Edit the canonical public source or canonical updater, never both consumer copies.
python3 shared-foundation/tools/manage.py release --version X.Y.Z
python3 shared-foundation/tools/manage.py plan --app both --version X.Y.Z
python3 shared-foundation/tools/manage.py adopt --app both --version X.Y.Z
python3 shared-foundation/tools/manage.py status --app both
```

The coordinating agent owns completion for BOTH consumers. Releases are immutable. `plan` reports changed destinations without adopting. `adopt` preflights both pins, verifies contract/Site identity/checksums, refuses locally modified managed files or active build leases, applies generated copies, runs common scoring and declared consumer compatibility tests, and rolls back its managed writes if either consumer fails. No deployment is performed. Generated outputs are not manually maintained as shared source.

After a data/scoring update, regenerate affected app-owned outputs and run each app's required regression/build checks before publishing. The updater does not reinterpret frozen model histories or automatically rerun costly matching studies. Coordinate those checks with the owning session; the user should not need to repeat requests or edit common files. A consumer may remain on an older pin for a documented incompatible experiment; do not force an upgrade or weaken tests.

## Concurrency and limitations

Updates take `shared-foundation/.update-lock/`. Builds take the app-local `.shared-foundation-use.lock/`. Child builds inherit a scoped lease token. These leases prevent a managed update from mixing source versions during a guarded build. A stale lease must be inspected using its recorded PID before removal.

The guard checks hashes, local release availability, official wording/response/scoring expectations, Site identity, managed symlinks and cross-repository runtime imports. It is not an OS sandbox and cannot attribute arbitrary concurrent manual edits. Agent ownership rules and code review remain required. Do not claim that a sibling's historical content snapshot must stay unchanged forever. The initial separation archive remains historical evidence only.

## Updating these instructions

A coordination change must update this document and both local contracts/AGENTS.md as needed, then notify the other session. Edit the updater once in `tools/manage.py`, issue a new release, and adopt it; copies in consumer `scripts/` are generated. Never mutate an existing release or lock by hand to suppress drift.

## Standalone generated-cache restore (tooling 1.3.1)

A consumer may omit unpacked `.cache/` reference files from Git when its complete pinned immutable archive is retained. After checkout, `python3 scripts/shared-foundation.py restore` recreates only missing managed files from that checksum-verified archive. It never changes a pin, overwrites existing drift, imports a sibling, builds, or deploys. Restore respects both update and app-build leases and rolls back newly added files if verification fails. Original consumers need no upgrade; 1.3.1 changes tooling/contract only, with public data identical to 1.2.0 and 1.3.0.
