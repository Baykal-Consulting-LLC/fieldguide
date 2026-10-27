import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {explorerCareerQuestions} from '../dist/open-explorer-056.js';
import {bridgeRegistry073,questionPool073,applyBridge073,consumeAnswers073,selectQuestions073,ledger073,bindingRules073,evidenceRoots073} from '../prototypes/evidence-073/engine.mjs';
import {decide}from'../prototypes/evidence-069/rules.mjs';
const bindings=JSON.parse(fs.readFileSync('calibration/cohort-056/question-bindings.json')),registry=bridgeRegistry073(bindings,explorerCareerQuestions),pool=questionPool073(registry),l=fs=>({yes:Object.fromEntries(fs.map(f=>[f,[{source:'fixture',id:f,quote:f}]])),no:{}}),answer=q=>({selected:[q.options[0].id],feedback:null,source:'student',confidence:'high',evidence:'Explicit isolated choice'});
const row=(rule,domains=['domain','method'])=>({id:rule.careerId,r:.5,specific:{supported:false,requirement:'Subject, method and distinctive responsibility need independent support.',specificDomains:domains,taskDomains:[],taskDomainCount:0,evidence:[],contrary:[],missing:[{id:rule.targetQuestionId}]}});
test('All seven previously unused question types now connect a positive choice to the intended defining facet',()=>{
 for(const q of pool.filter(q=>q.kind==='evidence'&&q.id.startsWith('evidence071-'))){const r=registry.find(r=>r.questionId===q.id&&['domain','method','responsibility'].includes(r.domain)),domains=['domain','method','responsibility'].filter(d=>d!==r.domain),rs=[row(r,domains)],led=l(r.all),out=applyBridge073(rs,{[q.id]:answer(q)},led,{byQuestion:{}},registry,pool);
 assert.ok(out.rows[0].specific.specificDomains.includes(r.domain),q.id);assert.ok(out.audit.some(a=>a.status==='Scoped choice connected'),q.id);assert.ok(out.consumed.some(c=>c.questionId===q.id&&c.status==='positive'));assert.equal(rs[0].specific.specificDomains.length,2);}
});
test('Unknown and alternative choices cannot supply a positive scoped interest; stale derived Yes is cleared',()=>{
 const q=pool.find(q=>q.id==='evidence071-client-budget'),yes=consumeAnswers073(l([]),{[q.id]:answer(q)},pool);
 for(const a of [{selected:[],feedback:'unfamiliar',source:'student'},{selected:[q.alternatives[0].id],feedback:null,source:'student'},{...answer(q),selected:['unrecognized-choice']},{...answer(q),reviewHold:'Needs review'}]){const x=consumeAnswers073(yes.ledger,{[q.id]:a},pool);assert.ok(!x.ledger.yes['e:client-budget-choice']);}
});
test('No, Unsure and held target records are preserved even with a new positive scoped choice',()=>{
 const q=pool.find(q=>q.id==='evidence071-client-budget'),r=registry.find(r=>r.questionId===q.id);for(const a of [{response:'no'},{response:'unsure'},{response:'unfamiliar',reviewHold:'Keep'}]){const original=structuredClone(a),x=applyBridge073([row(r)],{[q.id]:answer(q)},l(r.all),{byQuestion:{[r.targetQuestionId]:a}},registry,pool);assert.equal(x.rows[0].specific.supported,false);assert.equal(x.audit[0].status,'Recorded answer retained');assert.deepEqual(a,original);}
});
test('Technical safety includes the missed Electronics Engineer route and never becomes global or clinical safety',()=>{
 const q=pool.find(q=>q.id==='evidence071-safety-accountability');assert.ok(q.careerIds.includes('degree-17207200'));assert.ok(registry.filter(r=>r.questionId===q.id).every(r=>r.careerId.startsWith('degree-17')||['mechanical-engineering','electrical-engineering','architecture'].includes(r.careerId)));
 const x=consumeAnswers073(l([]),{[q.id]:answer(q)},pool);assert.ok(x.ledger.yes['e:technical-safety-choice']);assert.ok(!x.ledger.yes['r:safety']);assert.ok(!x.ledger.yes['r:clinical']);assert.ok(!x.ledger.yes['r:risk']);
});
test('One physical-model answer cannot invent numerical, testing or research interests or complete all three gates',()=>{
 const q=pool.find(q=>q.id==='evidence071-physical-model'),r=registry.find(r=>r.questionId===q.id),rs=[row(r,[])];rs[0].specific.missing=[{id:r.careerId+'-047-domain'},{id:r.careerId+'-047-method'},{id:r.careerId+'-047-responsibility'}];const x=applyBridge073(rs,{[q.id]:answer(q)},l([]),{byQuestion:{}},registry,pool);assert.deepEqual(x.rows[0].specific.specificDomains,['domain']);assert.equal(x.rows[0].specific.supported,false);for(const f of ['m:quantitative','m:testing','r:research'])assert.ok(!x.ledger.yes[f]);
});
test('Curriculum evaluation does not silently establish interest in coaching educators',()=>{
 const q=pool.find(q=>q.id==='evidence071-curriculum-review'),r=registry.find(r=>r.questionId===q.id),rs=[row(r,['domain','responsibility'])];const x=applyBridge073(rs,{[q.id]:answer(q)},l(['t:learning']),{byQuestion:{}},registry,pool);assert.equal(x.rows[0].specific.supported,false);assert.ok(x.rows[0].specific.missing.some(q=>q.id==='evidence071-educator-coaching'));
 const coach=pool.find(q=>q.id==='evidence071-educator-coaching'),z=applyBridge073([row(r,['domain'])],{[q.id]:answer(q),[coach.id]:answer(coach)},l(['t:learning']),{byQuestion:{}},registry,pool);assert.equal(z.rows[0].specific.supported,true);
});
test('Evidence roots preserve reused source identity without creating multiple independent observations',()=>{
 const q=pool.find(q=>q.id==='evidence071-event-commitments'),ref={source:'frozen-structured-profile',path:'positiveMethods',id:'organization',quote:'Original choice'};assert.equal(evidenceRoots073([ref,ref]).length,1);const x=consumeAnswers073(l([]),{[q.id]:{...answer(q),source:'profile-inferred',confidence:'medium',refs:[ref,ref]}},pool);assert.equal(x.consumed[0].reused,true);assert.equal(x.consumed[0].sourceRoots.length,1);
});
test('Reviewed binding repairs require concrete contexts and do not turn generic science or price comparison into specialist Yes',()=>{
 for(const career of ['biological-technician','management-analyst','degree-43911100','logistics','public-relations']){const rs=bindingRules073.filter(r=>r.careerId===career);assert.ok(rs.length);for(const r of rs)assert.notEqual(decide(l(['t:biology','t:finance','t:enterprise']),r).response,'yes');}
 const bad={yes:{'t:biology':[{questionId:'wrong-question',optionId:'science-workday-1',quote:'No'}]},no:{}};assert.ok(!ledger073(bad,bindings).yes['f:lab-procedure']);
});
test('Targeting caps new items at four, skips prior unknowns, and does not use identity, cohort, education or earnings',()=>{
 const rs=registry.map(r=>row(r,['domain','method'])),a=selectQuestions073(rs,registry,pool,{}),b=selectQuestions073(rs.map(r=>({...r,name:'Different person',cohort:'holdout',degree:true,pay:999999})),registry,pool,{});assert.ok(a.length<=4);assert.deepEqual(a.map(x=>x.q.id),b.map(x=>x.q.id));if(a.length){const prior={[a[0].q.id]:{selected:[],feedback:'unfamiliar'}};assert.ok(!selectQuestions073(rs,registry,pool,prior).some(x=>prior[x.q.id]));}
});
