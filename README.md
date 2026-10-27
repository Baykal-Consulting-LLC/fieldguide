# Fieldguide

Career exploration applications, still hosted on **ChatGPT Sites**. This public repository is the active source for Approach1, Approach2 and Approach3, with one canonical shared foundation. A GitHub push does not deploy or change a Site or live database.

| Folder | Purpose |
|---|---|
| `site/` | Approach1 Career Explorer |
| `approach-2/` | Independent College Pathways |
| `approach-3/` | Combined routes/careers prototype |
| `shared-foundation/` | Canonical shared data, immutable releases and updater |

Read [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) before work. The existing app-specific instructions and shared coordination contract still apply. Do not change a sibling app as incidental work or duplicate common fixes.

## Complete research access

All research, synthetic model data, evaluations, ledgers, historical snapshots and large data assets are retained in the **private** companion [fieldguide-research](https://github.com/Baykal-Consulting-LLC/fieldguide-research). Authorized Claude sessions can clone it next to this checkout, restore its private release assets, and consult all the research. The private repository's app copies are frozen research snapshots, not a second active implementation to maintain.

```sh
cd ~/Projects
gh repo clone Baykal-Consulting-LLC/fieldguide
gh repo clone Baykal-Consulting-LLC/fieldguide-research
cd fieldguide-research
python3 scripts/restore-research.py
python3 scripts/verify-handoff.py
```

For Claude Code, open `~/Projects/fieldguide` and allow the sibling research folder (for example `claude --add-dir ../fieldguide-research`). Claude's hosted GitHub integration must be granted access to **both** repositories by the organization owner. GitHub authentication alone does not grant a separate Claude service access.

## Development and hosting

Use Node24 and Python3. Run `python3 scripts/restore-pins.py` once, then enter the app folder, install from its lockfile, and follow package scripts. This restores missing data from existing pins without upgrading them. See [hosting and data](docs/HOSTING-AND-DATA.md). No production credentials or student account records are stored here. Firebase storage and existing Sites remain in place.

Public CI uses only standard GitHub-hosted runners and public source; it never fetches private research or production data. Private research jobs run locally unless explicitly configured otherwise. Required data licenses/attribution remain with their source directories; no new blanket license is asserted for third-party materials.
