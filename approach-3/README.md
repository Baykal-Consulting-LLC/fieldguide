# Fieldguide · Approach 3

Independent working prototype combining Approach 1 career evidence and Approach 2 college exploration. This repository has its own Site, build and browser storage. Neither original application is replaced or deployed by this project.

## Student journey

1. Nine lifestyle choices and an editable budget establish an income target.
2. The unchanged official 60-item interest assessment establishes broad interests.
3. Up to 24 adaptive career questions are selected sequentially from existing questions. There are no imported, accumulated or invented answers. Unknown responses remain unknown.
4. Results show careers, earnings and lifestyle fit across no-degree, training/certificate, associate and college/graduate routes. Career details show positive evidence and questions still needing confirmation.
5. Exact SOC–CIP links open Approach 2's pathways and program categories. All 36 pathways remain browsable. Optional eight-question subject reflection refines college exploration; planning choices do not change career evidence.

**Strong match** means the preserved career evidence requirements are met. **Worth exploring** means some career evidence is positive, with confirmation incomplete. **Interest connection** is a broad profile/activity connection. None is a probability of success. A program link alone never promotes a career.

## Resource coverage and boundaries

- 473 career evidence records and their question bank, routes and salary scenarios.
- 36 college pathways, complete program categories/crosswalk and 1,016 occupation reference titles.
- Official assessment/scoring/licensing, O*NET 31 descriptors, CIP crosswalk, BLS preparation, wage references and lifestyle/tax tools from immutable common release 1.3.1.
- A complete 5,590-file tracked-source inventory, plus the 88-item Approach 2 research/results-board handoff, is indexed in `research/`. The prior boards, pilots, designs and frozen studies remain research references, not student runtime or matching labels.
- No account migration, original-app storage, real student records, private database, analytics recorder or automatic sharing. Browser state uses only `fieldguide:approach-3:v1`.

Generated upstream copies are locked by `resources/snapshot.json`. They contain no runtime sibling imports or symlinks. Common assets originate from the canonical immutable release. Builds work without either sibling checkout. To refresh an app-specific snapshot, coordinate with the owning session and explicitly run `python3 scripts/import-resources.py`; never edit generated upstreams by hand. Shared changes still use the canonical release/plan/adopt workflow.

## Run and verify

```sh
npm ci # restores generated reference caches from the pinned archive
npm run resources:verify
npm run shared:check
npm run build
npm test
node scripts/check-cohorts.mjs
npm run dev
```

Open the printed localhost address. The two-thousand-case check is a historical preservation check with cohort groups reported separately. Test-only expected outcomes never enter the student bundle or a common release.

## Limits

This is a working integration, not a newly validated assessment. We have not established an increase in career accuracy, fresh 60+24 coverage or real student outcomes. The broader college catalog is browsable but does not acquire Approach 1 career-specific confirmation rules automatically. No college-specific offerings, admissions, transfer agreements, net price or degree-earnings premium are asserted.

Austin-area 2025 lower-paid-worker wage proxies and modeled five-year scenarios are occupational illustrations, with required preparation/experience separate. A broad fallback is explicitly a benchmark and cannot turn a lifestyle status green. The five-year clock begins after qualification. It does not represent five years after high school or a measured return on a degree.
