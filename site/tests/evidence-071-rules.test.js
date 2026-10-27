import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {decide} from '../prototypes/evidence-069/rules.mjs';
import {ledger071,mappingRules071,activityBank071,followupBank071,simulate071,selectFollowups071,researchRows071,supportedOrder071} from '../prototypes/evidence-071/engine.mjs';
const ledger=(yes=[],no=[])=>({yes:Object.fromEntries(yes.map(k=>[k,[{quote:'Explicit '+k,source:'test-typed-input',id:k}]])),no:Object.fromEntries(no.map(k=>[k,[{quote:'Negative '+k}]]))});
const row=(id,{domains=['one','two'],tasks=[],missing=[],supported=false,contrary=[]}={})=>({id,r:.7,specific:{supported,specificDomains:domains,taskDomains:tasks,taskDomainCount:tasks.length,evidence:[],missing,contrary,requirement:'Two distinct task contexts and both defining interests need support.'}});
test('Every new activity and mapping uses an existing career/question ID; positive options have explicit typed requirements',async()=>{
 const {explorerCareerQuestions}=await import('../dist/open-explorer.js');
 assert.equal(mappingRules071.length,16);assert.equal(activityBank071.length,24);assert.equal(followupBank071.length,33);
 for(const r of mappingRules071)assert.ok(explorerCareerQuestions(r.careerId).some(q=>q.id===r.questionId));
 for(const q of followupBank071){for(const id of q.careerIds)assert.ok(explorerCareerQuestions(id).length);for(const o of q.options)assert.ok(o.all.length);}
});
test('Ambiguous media choices and mismatched question IDs do not become filmed-editing or physical-product interests',()=>{
 const b=JSON.parse(fs.readFileSync('calibration/cohort-056/question-bindings.json'));
 const s={profileJourney:{depth:{creative:{'creative-refine-2':['creative-refine-2-4'],'wrong-question':['creative-make-2']}}}};
 const l=ledger071(ledger(),null,s,b,{});assert.equal(l.yes['f:shots-edit'],undefined);assert.equal(l.yes['f:physical-product'],undefined);
});
test('Exact saved laboratory activity choices repair precision and explanation only, not research responsibility or physics subject',()=>{
 const b=JSON.parse(fs.readFileSync('calibration/cohort-056/question-bindings.json'));
 const s={profileJourney:{depth:{science:{'science-workday':['science-workday-1','science-workday-4']}}}};
 const l=ledger071(ledger(),null,s,b,{});assert.ok(l.yes['m:precision']);assert.ok(l.yes['m:explaining']);assert.equal(l.yes['r:research'],undefined);assert.equal(l.yes['f:physical-model'],undefined);
 const held={explorer053:{fieldAnswers:{science:{'science-workday':{selected:['science-workday-1'],reviewHold:'needs review'}}}}};assert.equal(ledger071(ledger(),null,held,b,{}).yes['m:precision'],undefined);
});
test('Reference and product mappings need their concrete contexts; broad creativity and office organization cannot suffice',()=>{
 const librarian=mappingRules071.find(r=>r.questionId==='librarian-interest-044-1');
 assert.equal(decide(ledger(['t:information','m:organization']),librarian).response,'unfamiliar');
 assert.equal(decide(ledger(['f:reference-help','f:source-comparison','m:organization']),librarian).response,'yes');
 const product=mappingRules071.find(r=>r.questionId==='industrial-design-interest-044-2');
 assert.equal(decide(ledger(['t:visual','m:design','m:making','m:testing']),product).response,'unfamiliar');
});
test('Event responsibility does not need performing arts, but financial follow-through cannot be invented',()=>{
 const r=mappingRules071.find(r=>r.questionId==='degree-13112100-047-responsibility');
 assert.equal(decide(ledger(['f:financial-reconciliation','m:coordination','m:organization','m:precision']),r).response,'yes');
 assert.equal(decide(ledger(['t:enterprise','m:coordination','m:organization']),r).response,'unfamiliar');
});
test('A motion context is not quantitative, research or reporting preference',()=>{
 const r=mappingRules071.find(r=>r.questionId==='degree-19201200-047-responsibility');
 const l=ledger071(ledger(),null,{}, {options:{}},{},[{feature:'f:physical-model',refs:[{quote:'Existing motion/prediction context',path:'currentLife.enjoys.0'}]}]);
 assert.equal(decide(l,r).response,'unfamiliar');assert.equal(l.yes['m:quantitative'],undefined);assert.equal(l.yes['r:research'],undefined);
 assert.equal(decide(ledger(['f:physical-model','m:quantitative','m:testing','r:research','m:precision','m:explaining']),r).response,'yes');
});
test('Unknown or negative facts never produce a positive simulated activity',()=>{
 const q=activityBank071.find(q=>q.id==='activity071-food-records');
 assert.equal(simulate071(q,ledger(['t:food','m:precision'])).feedback,'unfamiliar');
 assert.equal(simulate071(q,ledger(['t:food','m:precision','r:research'],['m:precision'])).selected.length,0);
});
test('Activity contexts retain two defining interests and distinct task domains',()=>{
 const qs=activityBank071.filter(q=>q.careerIds.includes('food-science'));
 const answers=Object.fromEntries(qs.map(q=>[q.id,simulate071(q,ledger(['t:food','m:testing','m:precision','r:research']))]));
 const [a]=researchRows071([row('food-science')],answers,ledger(),{});assert.equal(a.specific.supported,true);assert.deepEqual(a.specific.taskDomains,['tasks','process']);
 const [b]=researchRows071([row('food-science',{domains:['one'],missing:[{id:'second-core'}]})],answers,ledger(),{});assert.equal(b.specific.supported,false);
 const [c]=researchRows071([row('food-science',{tasks:['tasks']})],{[qs[0].id]:answers[qs[0].id]},ledger(),{});assert.equal(c.specific.supported,false);
});
test('Generic health and clinical interest cannot establish vision; animal care/research cannot establish farm production',()=>{
 const rs=[row('degree-29104100',{domains:['domain','method','responsibility'],supported:true}),row('degree-19101100',{domains:['domain','method','responsibility'],supported:true})];
 const x=researchRows071(rs,{},ledger(['t:health','r:clinical','t:animals','r:research','m:testing']),{});
 assert.ok(x.every(r=>!r.specific.supported&&r.confirmation071));assert.ok(rs.every(r=>r.specific.supported));
 const [yes]=researchRows071([rs[0]],{},ledger(['f:vision-examination']),{});assert.equal(yes.specific.supported,true);
 const [direct]=researchRows071([rs[0]],{},ledger(),{'degree-29104100':{response:'yes',source:'student'}});assert.equal(direct.specific.supported,true);
 const [inferred]=researchRows071([rs[0]],{},ledger(),{'degree-29104100':{response:'yes',source:'profile-inferred',confidence:'medium',evidence:'General health'}});assert.equal(inferred.specific.supported,false);
});
test('Follow-up targeting is capped at four and does not read cohort, identity, pay or degree labels',()=>{
 const rs=activityBank071.flatMap(q=>q.careerIds).filter((x,i,a)=>a.indexOf(x)===i).map(id=>row(id));
 const l=ledger([...new Set(activityBank071.flatMap(q=>q.options.flatMap(o=>o.all)))]);
 const a=selectFollowups071(rs,l).map(q=>q.id),b=selectFollowups071(rs.map(r=>({...r,name:'Different person',cohort:'holdout',degree:!r.degree,budget:999999})),l).map(q=>q.id);
 assert.ok(a.length<=4);assert.equal(new Set(a).size,a.length);assert.deepEqual(a,b);
});
test('Research ranking uses correlation, defining domains and task domains, without a degree or pay boost',()=>{
 const a={...row('a',{supported:true}),r:.8,degree:false},b={...row('b',{supported:true}),r:.7,degree:true,pay:999999};assert.deepEqual(supportedOrder071([b,a]).map(r=>r.id),['a','b']);
});
