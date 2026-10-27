import fs from 'node:fs';
import assert from 'node:assert/strict';
import {freshJourney,profile,pathways,study} from '../src/engine.mjs';
const rows=JSON.parse(fs.readFileSync('tests/fixtures/compatibility-2000.json'));
const groups=new Map();
for(const r of rows){
 const j=freshJourney();j.officialAnswers=r.officialAnswers;
 const p=profile(j),ranked=study.scorePathways(pathways,p);
 assert.equal(p.complete,true,r.id);assert.deepEqual(p.raw,r.expectedRaw,r.id);
 const titles=r.rankable?ranked.slice(0,4).map(p=>p.title):[];
 assert.deepEqual(titles,r.expectedPathTitles,r.id);
 const key=r.collection+' / '+r.cohort,group=groups.get(key)||{collection:r.collection,cohort:r.cohort,models:0,officialScoresPreserved:0,pathwayOrderPreserved:0};
 group.models++;group.officialScoresPreserved++;group.pathwayOrderPreserved++;groups.set(key,group);
}
const report={date:'2026-10-25',cases:rows.length,method:'Historical compatibility replay. No fresh performance/accuracy or holdout claim. No new career answers inferred.',groups:[...groups.values()],failures:0};
fs.writeFileSync('docs/cohort-compatibility.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
