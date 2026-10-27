import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {ledgerFor,decide,evidenceRules069} from '../prototypes/evidence-069/rules.mjs';
import * as spec from '../calibration/cohort-056/spec.mjs';
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p));
const data=read('research/evidence-069/results.json.gz'),prior=read('research/evidence-068/results.json.gz'),bindings=read('calibration/cohort-056/question-bindings.json');
const degree=p=>p.routes.some(r=>['college','graduate'].includes(r.key)),grad=p=>p.routes.some(r=>r.key==='graduate'),empty=()=>({positiveTopics:[],negativeTopics:[],positiveMethods:[],negativeMethods:[],responsibilities:[]}),rule=id=>evidenceRules069.find(r=>r.questionId===id);
test('All 1,000 frozen cases are paired to both comparators and holdouts remain separate',()=>{
 const manifest=read('dist/developer/current-cohort-data.json'),base=manifest.parts.flatMap(p=>read('dist/developer/'+p.url).rows).filter(r=>r.phase!=='diagnostic049');
 assert.equal(data.baselineRunId,manifest.runId);assert.equal(data.rows.length,1000);assert.equal(new Set(data.rows.map(r=>r.id)).size,1000);
 assert.deepEqual(data.rows.map(r=>r.id).sort(),base.map(r=>r.id).sort());
 for(const row of data.rows){assert.deepEqual(row.beforeTop.map(p=>p.id),base.find(r=>r.id===row.id).top.map(p=>p.id));assert.deepEqual(row.priorTop.map(p=>p.id),prior.rows.find(r=>r.id===row.id).afterTop.map(p=>p.id));}
 assert.deepEqual(['development','holdout','holdout049','holdout056'].map(g=>data.rows.filter(r=>r.cohort===g).length),[758,30,12,200]);
});
test('Counts are independently recomputed by model, arm, canonical education route and cohort',()=>{
 for(const[g,s]of Object.entries(data.summary)){const rows=data.rows.filter(r=>g==='all'||r.cohort===g),count=f=>rows.filter(f).length;assert.equal(rows.length,s.models);
 for(const arm of['before','prior','after']){assert.equal(s[arm+'Top'],count(r=>r[arm+'Top'].length));assert.equal(s[arm+'Degree'],count(r=>r[arm+'Top'].some(degree)));assert.equal(s[arm+'Graduate'],count(r=>r[arm+'Top'].some(grad)));assert.equal(s[arm+'Covers'],count(r=>r[arm+'Top'].some(p=>p.budget.covers===true)));}
 assert.equal(s.gainedTop,count(r=>!r.priorTop.length&&r.afterTop.length));assert.equal(s.lostTop,count(r=>r.priorTop.length&&!r.afterTop.length));assert.equal(s.gainedDegree,count(r=>!r.priorTop.some(degree)&&r.afterTop.some(degree)));assert.equal(s.lostDegree,count(r=>r.priorTop.some(degree)&&!r.afterTop.some(degree)));}
 assert.deepEqual([data.summary.all.beforeTop,data.summary.all.priorTop,data.summary.all.afterTop],[789,795,812]);assert.deepEqual([data.summary.all.beforeDegree,data.summary.all.priorDegree,data.summary.all.afterDegree],[653,660,683]);
 assert.deepEqual([data.summary.all.priorGraduate,data.summary.all.afterGraduate],[139,152]);
});
test('Every inherited supported option, pay assumption and Top-three cap is preserved',()=>{
 for(const row of data.rows){assert.ok(row.afterTop.length<=3);for(const p of prior.rows.find(r=>r.id===row.id).afterSupported){const after=row.afterSupported.find(q=>q.id===p.id);assert.ok(after);assert.deepEqual(after.budget,p.budget);}}
 assert.equal(data.checks.supportedCareersLost,0);
});
test('Every retained Yes, No and hold is byte-identical; missing or blocked evidence never fills an answer',()=>{
 let conflicts=0,changed=0;for(const row of data.rows)for(const c of row.checks){if(c.retained){assert.equal(c.afterHash,c.beforeHash);assert.equal(c.after,c.before);}else if(c.decision==='yes'){changed++;assert.equal(c.after,'yes');assert.equal(c.missing.length+c.blocked.length,0);}else assert.equal(c.beforeHash,c.afterHash);conflicts+=c.before==='no'&&c.decision==='yes';}
 assert.equal(changed,586);assert.equal(conflicts,67);assert.equal(data.checks.knownProfessionAnswersChecked,28472);assert.equal(data.checks.reviewHoldsChecked,89);
});
test('A broad computing rating is not a concrete coding/test activity; career Yes cannot backfill interests',()=>{
 const state={explorer053:{facetAnswers:{'topic056-computing':{value:5,source:'student'}},professionAnswers:{software:{q:{response:'yes',source:'student'}}}}};
 const l=ledgerFor(null,state,bindings,spec);assert.ok(l.yes['t:computing']);assert.ok(!l.yes['f:code-test']);assert.equal(decide(l,rule('degree-15125100-047-method')).response,'unfamiliar');
 const onlyCareer=ledgerFor(null,{explorer053:{professionAnswers:{software:{q:{response:'yes',source:'student'}}}}},bindings,spec);assert.deepEqual(onlyCareer,{yes:{},no:{}});
});
test('Explicit saved activity IDs are validated against their question; prose and unrelated option IDs are ignored',()=>{
 const qid=bindings.options['technology-approach-1'].questionId,base={explorer053:{fieldAnswers:{technology:{[qid]:{selected:['technology-approach-1'],source:'student'}}}}};
 const l=ledgerFor(null,base,bindings,spec);assert.ok(l.yes['f:code-test']);assert.equal(l.yes['f:code-test'][0].quote,bindings.options['technology-approach-1'].text);
 assert.deepEqual(ledgerFor(null,{explorer053:{fieldAnswers:{technology:{bogus:{selected:['technology-approach-1','I love software'],source:'student'}}}}},bindings,spec),{yes:{},no:{}});
 const held=structuredClone(base);held.explorer053.fieldAnswers.technology[qid].reviewHold=true;assert.deepEqual(ledgerFor(null,held,bindings,spec),{yes:{},no:{}});
});
test('Contextual testing requires the actual activity plus independent accuracy or design evidence',()=>{
 const p={...empty(),positiveTopics:['computing'],positiveMethods:['precision']},r=rule('degree-15125100-047-method');assert.equal(decide(ledgerFor(p,{},bindings,spec),r).response,'yes');
 assert.equal(decide(ledgerFor({...p,positiveMethods:[]},{},bindings,spec),r).response,'unfamiliar');
 assert.equal(decide(ledgerFor({...p,negativeMethods:['testing']},{},bindings,spec),r).response,'unfamiliar');
 assert.equal(decide(ledgerFor({...p,positiveTopics:['electronics']},{},bindings,spec),r).response,'unfamiliar');
});
test('Health OR biology remains an alternative, while statistics and specific method evidence remain required',()=>{
 const r=rule('degree-15204101-047-domain');for(const t of['biology','health'])assert.equal(decide(ledgerFor({...empty(),positiveTopics:['statistics',t]},{},bindings,spec),r).response,'yes');
 assert.equal(decide(ledgerFor({...empty(),positiveTopics:['health']},{},bindings,spec),r).response,'unfamiliar');
 assert.equal(decide(ledgerFor({...empty(),positiveTopics:['statistics','health']},{},bindings,spec),rule('degree-15204101-047-method')).response,'unfamiliar');
});
test('Explaining is insufficient for college teaching without adult learners, course assessment and subject evidence',()=>{
 const r=rule('degree-25104200-047-method'),p={...empty(),positiveTopics:['biology','learning','adults'],positiveMethods:['explaining','design'],responsibilities:['assessment']};assert.equal(decide(ledgerFor(p,{},bindings,spec),r).response,'yes');
 for(const k of['responsibilities','positiveTopics']){const q=structuredClone(p);q[k]=k==='responsibilities'?[]:['biology','learning'];assert.equal(decide(ledgerFor(q,{},bindings,spec),r).response,'unfamiliar');}
});
test('New rules cannot turn purchasing into investment, biology into clinical care, or hobbies into specialist preferences',()=>{
 assert.ok(!evidenceRules069.some(r=>r.careerId==='financial-analysis'||r.careerId==='law'||/^degree-29/.test(r.careerId)));
 const p={...empty(),positiveTopics:['biology','health','purchasing','mathematics'],positiveMethods:['explaining','precision']},l=ledgerFor(p,{},bindings,spec);assert.ok(!l.yes['r:clinical']);assert.ok(!l.yes['r:patientcare']);assert.ok(!l.yes['r:risk']);assert.ok(!l.yes['r:representation']);assert.ok(!Object.keys(l.yes).some(k=>k.startsWith('s:')));
 const metadata={...p,id:'other',name:'Different',biography:'investigate investments gene expression',education:'graduate',salary:1e6,diagnosis:'anything'};assert.deepEqual(ledgerFor(metadata,{},bindings,spec),l);
});
test('All additional career claims meet unchanged specific and activity gates, with no contrary evidence',()=>{
 const profiles=new Map(read('calibration/cohort-056/profiles.json').map(p=>[p.id,p]));let total=0;
 for(const row of data.rows)for(const p of row.newSupported){total++;assert.ok(degree(p));assert.ok(evidenceRules069.some(r=>r.careerId===p.id));assert.equal(p.contrary.length+p.missing.length,0);const specific=p.evidence.filter(e=>e.kind==='specific');assert.ok(specific.length>=2);if(!p.id.startsWith('degree-'))assert.ok(p.taskDomains.length>=2);else assert.ok(new Set(specific.map(e=>e.domain)).size>=3);
 if(/^degree-17/.test(p.id)||['architecture','mechanical-engineering','electrical-engineering'].includes(p.id))assert.ok(profiles.get(row.id).responsibilities.includes('safety'));
 if(/^degree-25/.test(p.id)){assert.ok(profiles.get(row.id).responsibilities.includes('assessment'));assert.ok(profiles.get(row.id).positiveTopics.includes('adults'));}}
 assert.equal(total,256);assert.equal(data.claimCounts.length,28);
});
test('Lifestyle and graduate display displacements remain visible and their supported alternatives survive',()=>{
 const ls=data.rows.filter(r=>r.lostCovers),gs=data.rows.filter(r=>r.priorTop.some(grad)&&!r.afterTop.some(grad));assert.equal(ls.length,2);assert.equal(gs.length,1);
 for(const r of ls)assert.ok(r.afterSupported.some(p=>p.budget.covers===true));for(const r of gs)assert.ok(r.afterSupported.some(grad));
 assert.ok(fs.readFileSync('dist/evidence-benchmark-ui.js','utf8').includes('lifestyle-lost'));assert.ok(fs.readFileSync('dist/evidence-benchmark-ui.js','utf8').includes('graduate-lost'));
});
test('Screening and substantive review are distinguished, and frozen policies and production files are unchanged',()=>{
 assert.equal(data.inventoryReview.length,404);assert.equal(data.inventoryReview.filter(r=>r.ruleCount).length,46);assert.equal(evidenceRules069.length,62);
 const f=read('research/evidence-069/freeze-001.json');for(const[p,h]of Object.entries(f.files))assert.equal(createHash('sha256').update(fs.readFileSync(p)).digest('hex'),h,p);
 assert.deepEqual(read('dist/developer/evidence-benchmark-069.json.gz'),data);assert.equal(data.checks.liveFlowChanges,0);
});
test('Dashboard latest research is separate from both current output and the retained earlier benchmark',()=>{
 const s=read('analytics/performance/src/data.json');assert.equal(s.queries.models.rows.filter(r=>r.currentTop).length,789);assert.equal(s.queries.models.rows.filter(r=>r.currentDegree).length,653);
 assert.equal(s.queries.evidence_benchmark.rows.filter(r=>r.afterTop).length,795);assert.equal(s.queries.evidence_benchmark069.rows.length,1000);assert.equal(s.queries.evidence_benchmark069.rows.filter(r=>r.afterTop).length,812);assert.equal(s.queries.evidence_benchmark069.rows.filter(r=>r.afterDegree).length,683);
 assert.equal(s.queries.evidence_claims069.rows.reduce((n,r)=>n+r.models,0),256);
});
