# Fieldguide shared foundation

One canonical public source; two independently operating prototypes. Read [COORDINATION.md](COORDINATION.md) for the full ownership/update contract.

- `source/`: public data, official assessment and answer contract, maintained once.
- `tools/manage.py`: canonical release/check/adoption and build-lease tool.
- `consumers.json`: explicit per-app destinations, compatibility checks and preserved Site IDs.
- `releases/`: immutable, checksummed archives. The active release is recorded independently in each app's lock; development candidate archives are not automatic upgrades.
- `tests/`: adversarial update/rollback/concurrency tests in disposable fixtures.

Check both: `python3 shared-foundation/tools/manage.py check --app both` from the parent workspace. Consumer-local check: `npm run shared:check`. Consumer-local helpers do not require this directory or a sibling at build time.

The initial adoption does not change either prototype's runtime assessment bytes, app-specific matching, student answers, hosting audience or generated results. Shared-data imports remain outside the static publish directory except the already-identical assessment module. No sites are automatically published by this setup.
