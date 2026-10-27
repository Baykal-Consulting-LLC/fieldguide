import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {evidenceQueries071} from '../scripts/performance-evidence-071.mjs';
const d=JSON.parse(gunzipSync(fs.readFileSync('research/evidence-071/results.json.gz'))),degree=ps=>ps.some(p=>p.routes.some(r=>['college','graduate'].includes(r.key)));
test('Exactly 1000 frozen public profiles; fixed holdouts remain separate',()=>{
 assert.equal(d.rows.length,1000);assert.equal(new Set(d.rows.map(r=>r.id)).size,1000);
 assert.deepEqual(Object.fromEntries(['development','holdout','holdout049','holdout056'].map(g=>[g,d.rows.filter(r=>r.cohort===g).length])),{development:758,holdout:30,holdout049:12,holdout056:200});
 for(const [k,v] of Object.entries(d.checks))if(/Overwritten|Changed|newProfilePreferences|liveFlowChanges/.test(k))assert.equal(v,0,k);
});
test('Full replay totals reconcile, including losses and degree alternatives outside Top',()=>{
 for(const [group,s] of Object.entries(d.summary)){
  const rs=d.rows.filter(r=>group==='all'||r.cohort===group);assert.equal(rs.length,s.models);
  for(const arm of ['before','prior','after']){
   assert.equal(rs.filter(r=>r[arm+'Top'].length).length,s[arm+'Top']);
   assert.equal(rs.filter(r=>degree(r[arm+'Top'])).length,s[arm+'Degree']);
  }
  for(const flag of ['gainedTop','lostTop','gainedDegree','lostDegree'])assert.equal(rs.filter(r=>r[flag]).length,s[flag]);
  assert.equal(s.priorTop+s.gainedTop-s.lostTop,s.afterTop);assert.equal(s.priorDegree+s.gainedDegree-s.lostDegree,s.afterDegree);
  assert.equal(rs.filter(r=>degree(r.afterSupported)).length,s.afterAnyDegree);
  assert.equal(rs.filter(r=>!degree(r.afterTop)&&degree(r.afterSupported)).length,s.afterDegreeBelowCap);
 }
 assert.equal(d.summary.all.afterTop,818);assert.equal(d.summary.all.afterDegree,691);assert.equal(d.summary.all.lostTop,3);assert.equal(d.summary.all.lostDegree,6);
});
test('New item budget is four; unknown answers have no selected positive choice',()=>{
 let offered=0,positive=0,unknown=0;
 for(const r of d.rows){assert.ok(r.followups.length<=4);assert.equal(new Set(r.followups.map(a=>a.questionId)).size,r.followups.length);
 for(const a of r.followups){offered++;const q=d.questionBank.find(q=>q.id===a.questionId);assert.ok(q);if(a.selected.length){positive++;assert.equal(a.feedback,null);assert.ok(a.refs.length);for(const id of a.selected)assert.ok(q.options.some(o=>o.id===id));}else{unknown++;assert.equal(a.feedback,'unfamiliar');}}
 }
 assert.deepEqual([offered,positive,unknown],[992,320,672]);
});
test('All earlier support retained except documented specialist claims; rankings capped at three',()=>{
 const allowed=new Set(['degree-29104100','degree-19101100']);let removed=0;
 for(const r of d.rows){assert.ok(r.afterTop.length<=3);const ids=new Set(r.afterSupported.map(p=>p.id));for(const p of r.priorSupported)if(!ids.has(p.id)){removed++;assert.ok(allowed.has(p.id));assert.ok(r.reclassified.some(x=>x.id===p.id&&x.confirmation));}
  for(const p of r.afterTop)assert.ok(ids.has(p.id));
  for(const [id,f] of [['degree-29104100','f:vision-examination'],['degree-19101100','f:animal-production']])if(ids.has(id))assert.ok(r.ledger.yes[f]?.length,`${r.id}: ${id} lacks explicit specialty`);
 }
 assert.equal(removed,44);
});
test('Known or held core checks are never rewritten; pay retained across paired offers',()=>{
 for(const r of d.rows){for(const c of r.checks)if(c.retained||c.hold)assert.equal(c.beforeHash,c.afterHash);
 const old=new Map(r.priorSupported.map(p=>[p.id,p]));for(const p of r.afterSupported)if(old.has(p.id))assert.deepEqual(p.budget,old.get(p.id).budget);
 }
});
test('Dashboard projection matches downloadable research and all cohorts',()=>{
 const q=evidenceQueries071(d.baselineRunId);assert.equal(q.evidence_models071.rows.length,1000);assert.equal(q.evidence_questions071.rows.length,33);
 assert.equal(q.evidence_models071.rows.filter(r=>r.afterDegree).length,691);assert.equal(q.evidence_models071.rows.filter(r=>r.afterBelowCap).length,67);
 assert.equal(q.evidence_models071.rows.reduce((n,r)=>n+r.reclassifiedCount,0),44);
});
test('Frozen rules, source profiles and production engine bytes remain unchanged',()=>{
 const frozen=JSON.parse(fs.readFileSync('research/evidence-071/freeze-001.json'));
 for(const [path,sha] of Object.entries(frozen.files))assert.equal(createHash('sha256').update(fs.readFileSync(path)).digest('hex'),sha,path);
});
test('Compressed historical study retains exact original bytes and usable download metadata',()=>{
 const pointer=JSON.parse(fs.readFileSync('dist/developer/explorer-053-data.json'));
 if(!pointer.historical)return;
 const raw=gunzipSync(fs.readFileSync('dist/developer/explorer-053-data.json.gz'));
 assert.equal(createHash('sha256').update(raw).digest('hex'),pointer.sourceSHA256);
 assert.ok(JSON.parse(raw).rows.length);
 const meta=JSON.parse(fs.readFileSync('dist/developer/validation/explorer-053.json'));assert.equal(meta.rowsURL,'../explorer-053-data.json.gz');
});
