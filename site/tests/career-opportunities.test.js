import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {careerOpportunities} from '../dist/career-opportunities.js';
import {educationRoutesFor,educationRouteGroups,experienceBeforeRole} from '../dist/education-routes.js';
import {opportunitiesPanel,educationBadges} from '../dist/career-opportunities-ui.js';
import {occupationById,occupations} from '../dist/occupation-data.js';
import {professionSuggestions,journeyInterestPicture} from '../dist/profile-journey.js';
import {modelLabPlan} from '../dist/model-lab-engine.js';
import {roundSalary} from '../dist/salary-progression.js';
const caseFor=id=>JSON.parse(fs.readFileSync('validation/blind-2026-10-18/'+id+'.json'));
const ids=rows=>rows.map(r=>r.o.id);
test('every career has explicit preparation badges; regulated jobs do not pretend no preparation is needed',()=>{
 for(const o of occupations){const rs=educationRoutesFor(o);assert.ok(rs.length,o.id);assert.ok(rs.every(r=>educationRouteGroups.some(g=>g.id===r.key)&&r.label));assert.match(educationBadges(o),/Education routes/);}
 for(const id of ['hairdresser','tattoo','police','truck-driver','vocational-nurse'])assert.equal(educationRoutesFor(occupationById(id))[0].key,'program');
 assert.deepEqual(educationRoutesFor(occupationById('nursing')).map(r=>r.key),['program','college']);assert.match(educationRoutesFor(occupationById('nursing'))[1].detail,/no assumed BSN pay premium/);
 assert.equal(educationRoutesFor(occupationById('electrician'))[0].key,'apprenticeship');assert.equal(educationRoutesFor(occupationById('dentist'))[0].key,'graduate');
});
test('income alternatives preserve original interests, scores, answers, completed steps and notes',()=>{
 const s=caseFor('life-013').experimentState;s.actions.push({id:'test-kept',title:'Work tried',done:true,notice:'Enjoyed drawing.'});const before=JSON.stringify(s),original=ids(professionSuggestions(s).top),raw=journeyInterestPicture(s).raw;
 const p=careerOpportunities(s);assert.equal(JSON.stringify(s),before);assert.deepEqual(p.originalIds,original);assert.equal(p.usesEducationToRank,false);assert.equal(p.usesIncomeToRank,false);
 const changed=structuredClone(s);changed.finance.lifestyle.travel='2000';careerOpportunities(changed);assert.deepEqual(ids(professionSuggestions(changed).top),original);assert.deepEqual(journeyInterestPicture(changed).raw,raw);
 if(p.funded.length){const plan=modelLabPlan(s,p.funded[0].id);assert.ok(plan);assert.ok(plan.plan.steps.some(a=>a.id==='test-kept'&&a.done&&a.notice==='Enjoyed drawing.'));assert.equal(JSON.stringify(s),before);}
});
test('148 frozen lives retain core matches; income-cover claims reconcile to budgets and visible rounding',()=>{
 let count=0,funded=0,after=0;const noOptions=[];
 for(const phase of ['development','holdout','supplement','legacy'])for(const r of JSON.parse(fs.readFileSync('validation/blind-2026-10-18/'+phase+'-summary.json')).students){const c=caseFor(r.id),s=c.experimentState,before=JSON.stringify(s),p=careerOpportunities(s);count++;assert.equal(JSON.stringify(s),before,r.id);assert.deepEqual(ids(professionSuggestions(s).top),c.results.professions.map(x=>x.id),r.id);
 for(const row of p.funded){funded++;assert.ok(row.start.covers,r.id+':'+row.id);assert.ok(row.start.remaining>=0);assert.ok(roundSalary(row.firstPay)>=p.goal.low);assert.ok(!experienceBeforeRole.has(row.id));}
 for(const row of p.afterTraining){after++;assert.ok(!row.meetsAtStart&&row.meetsQualified&&row.entry.covers);assert.ok(roundSalary(row.qualifiedPay)>=p.goal.low);}
 for(const row of p.rows.filter(r=>!r.supported)){assert.match(row.scope,/Related idea/);assert.ok(row.connection);}
 for(const g of p.groups)assert.ok(g.rows.every(r=>r.routes.some(route=>route.key===g.id)));
 if(!p.rows.length)noOptions.push(r.id);
 }
 assert.equal(count,148);assert.ok(funded>100);assert.ok(after>=0);assert.ok(noOptions.length>0,'Open profiles must remain open, not gain a forced winner.');
});
test('shared generic engineering work alone does not send a carpenter into biomedical engineering',()=>{
 const p=careerOpportunities(caseFor('life-024').experimentState);assert.ok(p.originalIds.includes('carpentry'));assert.ok(!p.funded.some(r=>r.id==='biomedical-engineering'));
});
test('paid apprenticeships have distinct training and qualified pay, without turning experience jobs into entry roles',()=>{
 const p=careerOpportunities(caseFor('life-094').experimentState),electrician=p.rows.find(r=>r.id==='electrician');assert.ok(electrician);assert.ok(electrician.paidTraining);assert.notEqual(electrician.firstStage,'entry');assert.notEqual(electrician.firstPay,electrician.qualifiedPay);assert.equal(electrician.firstPay,electrician.paidTraining.amount);assert.ok(p.funded.every(r=>!r.requiresExperience));
});
test('comparison UI is escaped, compact, and does not open the real student guide from model reviews',()=>{
 const s=caseFor('life-013').experimentState,html=opportunitiesPanel(s,{compact:true,compareOnly:true});assert.match(html,/Compare all five education routes/);assert.match(html,/data-preview=/);assert.doesNotMatch(html,/href="#\/journey\/profession/);assert.doesNotMatch(html,/\$\{|undefined|NaN/);assert.match(html,/not a confirmed match|not a confirmed/);assert.match(html,/not automatic promotions/);
 const student=opportunitiesPanel(s,{compact:true});assert.match(student,/href="#\/journey\/profession\//);
});
import {walkthroughState} from '../dist/journey-walkthroughs.js';
test('medical practice pay is offered after qualification when residency pay cannot cover a higher goal',()=>{
 const s=walkthroughState('medicine',{plan:true});s.finance.lifestyle.travel='500';const p=careerOpportunities(s,{anchorId:'nursing'}),doctor=p.afterTraining.find(r=>r.id==='physician');assert.ok(doctor);assert.equal(doctor.firstStage,'residency');assert.ok(!doctor.meetsAtStart&&doctor.meetsQualified);assert.ok(doctor.firstPay<doctor.qualifiedPay);
});
test('editorial styling-to-design connections need separate creative-field interest and remain unconfirmed',()=>{
 const s=walkthroughState('creative',{plan:true}),p=careerOpportunities(s,{anchorId:'hairdresser'}),bridge=p.rows.find(r=>r.id==='web-interface-design');assert.ok(bridge?.editorialBridge);assert.equal(bridge.supported,false);assert.match(bridge.connection,/visual result|needs/);assert.match(bridge.scope,/Related idea/);
 for(const id of Object.keys(s.profileJourney.fieldPreferences))if(id.includes('creative'))s.profileJourney.fieldPreferences[id]=1;
 const declined=careerOpportunities(s,{anchorId:'hairdresser'});assert.ok(!declined.rows.some(r=>r.editorialBridge));
});
