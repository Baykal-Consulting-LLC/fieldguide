import fs from'node:fs';import{createHash}from'node:crypto';import{signature093}from'./evidence-093-cache.mjs';
export function signature094(){const h=createHash('sha256').update(signature093());for(const p of['scripts/rerun-evidence-094.mjs','prototypes/evidence-094/targeting.mjs'])h.update(fs.readFileSync(p));return h.digest('hex');}
