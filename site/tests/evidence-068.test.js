import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {connect,structuredLedger,ledgerFromChoices} from '../prototypes/targeted-067/engine.mjs';
import {topics,methods} from '../calibration/cohort-056/spec.mjs';
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p));
const r=read('research/evidence-068/results.json.gz'),f=read('research/evidence-068/freeze-001.json');
const degree=p=>p.routes.some(x=>x.key==='college'||x.key==='graduate');
test('Exactly all 1,000 public models are paired to the current baseline, with fixed separate holdouts',()=>{
 const m=read('dist/developer/current-cohort-data.json'),base=m.parts.flatMap(p=>read('dist/developer/'+p.url).rows).filter(r=>r.phase!=='diagnostic049');
 assert.equal(r.baselineRunId,m.runId);assert.equal(r.rows.length,1000);assert.equal(new Set(r.rows.map(x=>x.id)).size,1000);
 assert.deepEqual(r.rows.map(x=>x.id).sort(),base.map(x=>x.id).sort());
 for(const row of r.rows)assert.deepEqual(row.beforeTop.map(x=>x.id),base.find(x=>x.id===row.id).top.map(x=>x.id));
 assert.deepEqual(['development','holdout','holdout049','holdout056'].map(g=>r.rows.filter(x=>x.cohort===g).length),[758,30,12,200]);
 assert.ok(!r.rows.some(x=>x.phase==='private'||x.phase==='diagnostic049'));
});
test('All reported counts and education definitions are independently recomputed from paired rows',()=>{
 for(const[g,s]of Object.entries(r.summary)){const rows=r.rows.filter(x=>g==='all'||x.cohort===g),n=fn=>rows.filter(fn).length;
 assert.equal(s.models,rows.length);assert.equal(s.beforeTop,n(x=>x.beforeTop.length));assert.equal(s.afterTop,n(x=>x.afterTop.length));assert.equal(s.beforeDegree,n(x=>x.beforeTop.some(degree)));assert.equal(s.afterDegree,n(x=>x.afterTop.some(degree)));
 assert.equal(s.beforeCovers,n(x=>x.beforeTop.some(p=>p.budget.covers===true)));assert.equal(s.afterCovers,n(x=>x.afterTop.some(p=>p.budget.covers===true)));
 assert.equal(s.gainedTop,n(x=>!x.beforeTop.length&&x.afterTop.length));assert.equal(s.lostTop,n(x=>x.beforeTop.length&&!x.afterTop.length));assert.equal(s.gainedDegree,n(x=>!x.beforeTop.some(degree)&&x.afterTop.some(degree)));assert.equal(s.lostDegree,n(x=>x.beforeTop.some(degree)&&!x.afterTop.some(degree)));
 assert.ok(rows.every(x=>x.afterTop.length<=3));}
 assert.deepEqual([r.summary.all.beforeTop,r.summary.all.afterTop,r.summary.all.beforeDegree,r.summary.all.afterDegree],[789,795,653,660]);
 assert.equal(r.summary.all.lostTop+r.summary.all.lostDegree,0);
});
test('Every previously supported career and earnings assumption remains available',()=>{
 const m=read('dist/developer/current-cohort-data.json'),base=m.parts.flatMap(p=>read('dist/developer/'+p.url).rows);
 for(const row of r.rows)for(const p of base.find(x=>x.id===row.id).supported){const after=row.afterSupported.find(x=>x.id===p.id);assert.ok(after);assert.deepEqual(after.budget,p.budget);}
});
test('All known answers, No conflicts and holds survive; unknown evidence never produces Yes',()=>{
 let conflicts=0,holds=0,added=0;
 for(const row of r.rows)for(const c of row.checks){if(c.before?.reviewHold||['yes','no'].includes(c.before?.response)){assert.ok(c.retained);assert.deepEqual(c.before,c.after);holds+=!!c.before.reviewHold;conflicts+=c.before.response==='no'&&c.decision.response==='yes';}
 else if(c.decision.response==='yes'){added++;assert.equal(c.after.response,'yes');assert.equal(c.after.confidence,'medium');assert.ok(c.decision.evidence.length);}
 else assert.deepEqual(c.before,c.after);}
 assert.equal(added,49);assert.equal(conflicts,4);assert.equal(holds,4);
});
test('New claims come only from frozen contextual rules, not a per-model follow-up answer lookup',()=>{
 const profiles=new Map(read('calibration/cohort-056/profiles.json').map(p=>[p.id,p]));
 for(const row of r.rows)for(const p of row.newSupported){assert.ok(['degree-15202100','degree-27204100'].includes(p.id));assert.equal(p.missing.length,0);assert.equal(p.contrary.length,0);
 if(profiles.has(row.id)){const profile=profiles.get(row.id);assert.ok(profile.positiveTopics.includes('mathematics'));assert.ok(profile.positiveMethods.includes('formalproof'));assert.ok(profile.positiveMethods.includes('explaining'));}}
 assert.equal(r.rows.flatMap(x=>x.newSupported).length,28);
 assert.ok(!fs.readFileSync('scripts/benchmark-evidence-068.mjs','utf8').includes("read('research/targeted-066/results"));
});
test('Unencoded interests are unknown and protected from broad-theme, demographic and free-text inference',()=>{
 assert.equal(r.rows.filter(x=>x.encoded).length,92);assert.equal(r.rows.filter(x=>x.source==='Authored profile'&&x.encoded).length,4);
 assert.ok(r.rows.filter(x=>!x.encoded).every(x=>x.checks.every(c=>c.decision.response==='unfamiliar')));
 const p={positiveTopics:['mathematics','sound'],negativeTopics:[],positiveMethods:['quantitative','expression','explaining'],negativeMethods:[]};
 assert.equal(connect(structuredLedger(p,{topics,methods}),'degree-15202100','method').response,'unfamiliar');
 assert.equal(connect(structuredLedger(p,{topics,methods}),'degree-27204100','responsibility').response,'unfamiliar');
 assert.deepEqual(ledgerFromChoices({'evidence-math-pattern':['skip','I love maths']}),{yes:{},no:{}});
});
test('Partial history/art evidence stays exploratory; composition does not imply conducting',()=>{
 for(const id of ['life-017','life-046']){const row=r.rows.find(x=>x.id===id);assert.ok(row.candidates.length);assert.ok(!row.newSupported.length);assert.ok(row.candidates.some(x=>x.missing.length));}
 assert.ok(fs.readFileSync('dist/evidence-benchmark-ui.js','utf8').includes('conducting unassessed'));
});
test('Frozen rules, profiles, scoring and budgets remain unchanged; developer copy is exact',()=>{
 for(const[p,h]of Object.entries(f.files))assert.equal(createHash('sha256').update(fs.readFileSync(p)).digest('hex'),h,p);
 assert.deepEqual(read('dist/developer/evidence-benchmark-068.json.gz'),r);
 assert.equal(r.checks.liveFlowChanges,0);
});
test('Dashboard and comparison chart share this benchmark, with no promotion into production totals',()=>{
 const d=read('analytics/performance/src/data.json'),rows=d.queries.evidence_benchmark.rows;
 assert.equal(rows.length,1000);assert.equal(rows.filter(x=>x.beforeTop).length,789);assert.equal(rows.filter(x=>x.afterTop).length,795);assert.equal(rows.filter(x=>x.afterDegree).length,660);
 assert.equal(d.queries.models.rows.filter(x=>x.currentTop).length,789);assert.equal(d.queries.models.rows.filter(x=>x.currentDegree).length,653);
 assert.ok(fs.readFileSync('dist/developer/model-match-chart.html','utf8').includes('id="evidence-benchmark"'));
});
