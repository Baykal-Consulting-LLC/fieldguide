// Research-only human-reviewed structured overlay. No runtime prose matching.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const review=JSON.parse(fs.readFileSync('research/evidence-097/legacy-facts.json'));
export const legacyProfiles097=review.rows.map(r=>{
 const source=fs.readFileSync(r.source);assert.equal(createHash('sha256').update(source).digest('hex'),r.sourceSHA256,r.id+' frozen source');
 const p={id:r.id,positiveTopics:[],negativeTopics:[],positiveMethods:[],negativeMethods:[],responsibilities:[],specialtyPreferences060:{},evidence097:r.facts,reviewStatus097:r.reviewStatus};
 for(const f of r.facts){if(f.simulatorEligible===false)continue;assert.ok(f.sourceText.includes(f.quote));const [kind,key]=f.feature.split(':');if(kind==='s')p.specialtyPreferences060[key]=f.value;else {const dest=kind==='t'?(f.value==='yes'?'positiveTopics':'negativeTopics'):kind==='m'?(f.value==='yes'?'positiveMethods':'negativeMethods'):'responsibilities';assert.ok(kind!=='r'||f.value==='yes');if(!p[dest].includes(key))p[dest].push(key);}}
 return p;
});
assert.equal(legacyProfiles097.length,172);assert.equal(new Set(legacyProfiles097.map(p=>p.id)).size,172);
