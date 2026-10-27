# Hosting and data boundaries

App hosting remains ChatGPT Sites. Existing .openai/hosting.json project identities are preserved. Source repositories for Sites remain separate; a push here is not automatic publication. Use fresh native Sites access and its supported source helper to synchronize reviewed app changes, run required checks/build under shared leases, and package/save/deploy the same Site with its audience preserved. No publishing credential or deploy token is included. We have not deployed or changed live hosting in this migration.

Approach1 uses Firebase Authentication and Firestore, documented in site/docs/firebase-migration-2026-10-17.md. Account records stay in Firebase; browser drafts stay on devices. Source includes rules, schemas, migrations and emulator tooling. Never export live account records into Git or private research merely to set up development. No database cutover occurred. Approach2's optional D1 starter is not proof a production D1 database exists.

The complete research workspace is private at Baykal-Consulting-LLC/fieldguide-research. Its release assets are private and restore into that sibling only. Do not copy private content into this checkout to satisfy a public build. The public apps carry their existing public runtime/reference data and pin archives independently.

GitHub states standard GitHub-hosted runner usage is free for public repositories: https://docs.github.com/en/actions/concepts/billing-and-usage . Larger runners and other products have separate billing rules. No paid runner or private research Actions workflow is configured by this handoff.
