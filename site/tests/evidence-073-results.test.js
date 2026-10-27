import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {evidenceQueries073} from '../scripts/performance-evidence-073.mjs';
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p));
const d=read('research/evidence-073/results.json.gz'),old=read('research/evidence-071/results.json.gz'),byId=new Map(old.rows.map(r=>[r.id,r]));
const degree=ps=>ps.some(p=>p.routes.some(r=>['college','graduate'].includes(r.key)));
test('1000 fixed profiles; separate holdouts and exact 0.71 comparison',()=>{
 assert.equal(d.rows.length,1000);assert.equal(new Set(d.rows.map(r=>r.id)).size,1000);
 assert.deepEqual(Object.fromEntries(['development','holdout','holdout049','holdout056'].map(g=>[g,d.rows.filter(r=>r.cohort===g).length])),{development:758,holdout:30,holdout049:12,holdout056:200});
 for(const r of d.rows){const prev=byId.get(r.id);assert.deepEqual(r.priorTop,prev.afterTop);assert.deepEqual(r.priorSupported,prev.afterSupported);assert.deepEqual(r.reusedFollowups,prev.followups);assert.deepEqual(r.retainedSpecialistHolds,prev.reclassified);}
 for(const [k,v] of Object.entries(d.checks))if(/Overwritten|Changed|newProfilePreferences|liveFlowChanges/.test(k))assert.equal(v,0,k);
});
test('Every stage, gain/loss and degree alternative reconciles for every cohort',()=>{
 for(const[g,s]of Object.entries(d.summary)){
  const rs=d.rows.filter(r=>g==='all'||r.cohort===g);assert.equal(rs.length,s.models);
  for(const a of['before','prior','binding','wired','after']){
   assert.equal(rs.filter(r=>r[a+'Top'].length).length,s[a+'Top']);assert.equal(rs.filter(r=>degree(r[a+'Top'])).length,s[a+'Degree']);
   assert.equal(rs.filter(r=>r[a+'Top'].some(p=>p.routes.some(x=>x.key==='graduate'))).length,s[a+'Graduate']);
   assert.equal(rs.filter(r=>r[a+'Top'].some(p=>p.budget.covers===true)).length,s[a+'Covers']);
  }
  for(const k of['gainedTop','lostTop','gainedDegree','lostDegree','gainedGraduate','lostGraduate','gainedCovers','lostCovers'])assert.equal(rs.filter(r=>r[k]).length,s[k]);
  for(const k of['Top','Degree','Graduate','Covers'])assert.equal(s['prior'+k]+s['gained'+k]-s['lost'+k],s['after'+k]);
  assert.equal(rs.filter(r=>degree(r.afterSupported)).length,s.afterAnyDegree);assert.equal(rs.filter(r=>!degree(r.afterTop)&&degree(r.afterSupported)).length,s.afterDegreeBelowCap);
 }
 assert.deepEqual(['priorTop','afterTop','priorDegree','afterDegree','afterGraduate','afterCovers'].map(k=>d.summary.all[k]),[818,820,691,696,158,258]);
});
test('Every previously supported option survives with identical earnings and education; no cap change',()=>{
 for(const r of d.rows){const after=new Map(r.afterSupported.map(p=>[p.id,p]));assert.ok(r.afterTop.length<=3);
 for(const p of r.priorSupported){assert.ok(after.has(p.id));assert.deepEqual(after.get(p.id).budget,p.budget);assert.deepEqual(after.get(p.id).routes,p.routes);}
 for(const p of r.afterTop)assert.ok(after.has(p.id));
 for(const c of r.checks)if(c.retained||c.hold||['yes','no','unsure'].includes(c.before))assert.equal(c.beforeHash,c.afterHash);
 }
});
test('New questions stay within budget, never re-ask old unknowns, and preserve unknown answers',()=>{
 let n=0,positive=0,unknown=0;
 for(const r of d.rows){assert.ok(r.followups.length<=4);const prior=new Set(r.reusedFollowups.map(a=>a.questionId));assert.equal(new Set(r.followups.map(a=>a.questionId)).size,r.followups.length);
 for(const a of r.followups){assert.ok(!prior.has(a.questionId));n++;if(a.selected.length){positive++;assert.ok(a.refs.length);assert.equal(a.feedback,null);}else{unknown++;assert.equal(a.feedback,'unfamiliar');}}
 for(const c of r.consumed){if(c.status==='positive')assert.ok(c.sourceRoots.length);assert.equal(new Set(c.sourceRoots).size,c.sourceRoots.length);}
 }
 assert.deepEqual([n,positive,unknown],[196,10,186]);
});
test('All seven prior answer types are connected; stage attribution and disagreement stay visible',()=>{
 const types=['physical-model','research-report','event-commitments','safety-accountability','curriculum-review','educator-coaching','client-budget'];
 for(const t of types)assert.ok(d.registry.some(r=>r.questionId==='evidence071-'+t));
 assert.equal(d.checks.mappingRules,10);assert.equal(d.checks.scopedEvidenceTypes,7);assert.equal(d.summary.all.mappingFills,46);
 assert.equal(d.summary.all.bindingTop,d.summary.all.wiredTop);assert.equal(d.summary.all.wiredTop,d.summary.all.afterTop);
 assert.equal(d.summary.all.newClaims,14);assert.equal(d.rows.flatMap(r=>r.newSupported).filter(p=>p.r!=null&&p.r<0).length,3);
});
test('Dashboard projection exposes every stage and reconciles all reviewed rows',()=>{
 const q=evidenceQueries073(d.baselineRunId);assert.equal(q.evidence_models073.rows.length,1000);assert.equal(q.evidence_questions073.rows.length,36);
 assert.equal(q.evidence_models073.rows.filter(r=>r.afterDegree).length,696);assert.equal(q.evidence_models073.rows.reduce((n,r)=>n+r.broadDisagreement,0),3);
 assert.equal(q.evidence_questions073.rows.reduce((n,r)=>n+r.allOffered,0),196);assert.equal(q.evidence_questions073.rows.reduce((n,r)=>n+r.allReused,0),992);
});
test('Frozen rule, production and profile bytes unchanged; reporting amendment is caption-only',()=>{
 const f=read('research/evidence-073/freeze-001.json');for(const[p,h]of Object.entries(f.files))assert.equal(createHash('sha256').update(fs.readFileSync(p)).digest('hex'),h,p);
 const original=fs.readFileSync('research/evidence-073/benchmark-original.mjs.txt','utf8'),now=fs.readFileSync('scripts/benchmark-evidence-073.mjs','utf8');assert.equal(original.replace('Eleven reviewed binding repairs','Ten reviewed binding rules').replace('Eleven binding repairs','Ten binding rules'),now);
});
test('Historical 0.51 compression retains exact bytes and a usable download link',()=>{
 const pointer=read('dist/developer/broad-exploration-051-data.json');if(!pointer.historical)return;
 const original=gunzipSync(fs.readFileSync('dist/developer/broad-exploration-051-data.json.gz'));
 assert.equal(createHash('sha256').update(original).digest('hex'),pointer.sourceSHA256);assert.ok(JSON.parse(original).rows.length);
 assert.equal(read('dist/developer/validation/broad-exploration-051.json').rowsURL,'../broad-exploration-051-data.json.gz');
});
