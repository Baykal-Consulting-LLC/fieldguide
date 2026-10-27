// Strengthen the frozen comparator's identity check without changing its source.
import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const original=fs.readFileSync('scripts/executor-077/compare.mjs','utf8'),needle="if(identity)assert.deepEqual(b.top.map(p=>p.id),a.top.map(p=>p.id),model.id+' answer round-trip changed Top');";
assert.ok(original.includes(needle));const tmp='scripts/executor-077/.identity-full-077.mjs';
try{fs.writeFileSync(tmp,original.replace(needle,"if(identity)assert.deepEqual(b,a,model.id+' answer round-trip changed a career category, rank, score, education or budget');"));execFileSync(process.execPath,[tmp,'--identity-check'],{stdio:'inherit'});}finally{fs.rmSync(tmp,{force:true});}
