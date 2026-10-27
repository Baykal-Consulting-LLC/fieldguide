import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {careerCheckSpec,careerCheckComplete,updateCareerCheck,finishCareerCheckQuestion} from '../dist/career-check-questions.js';
import {professionQuestions} from '../dist/profession-questions.js';
import {careerComparisonOptions} from '../dist/career-comparisons.js';
import {careerCheckPage,careerComparisonsPanel} from '../dist/career-comparisons-ui.js';
import {planMatchCandidates,selectTopPlanMatches} from '../dist/plan-matches.js';
import {educationRoutesFor} from '../dist/education-routes.js';
import {occupationById} from '../dist/occupation-data.js';
import {journeyInterestPicture,profileResume} from '../dist/profile-journey.js';
import {sanitizeState} from '../dist/model.js';
import {studentModelState,studentModelScreen} from '../dist/student-model-view.js';
const raw=id=>JSON.parse(fs.readFileSync('validation/blind-2026-10-18/'+id+'.json'));
function answerFor(s,id,{all=false,skip=false}={}){const spec=careerCheckSpec(id);for(const q of spec.questions){if(skip)updateCareerCheck(s,{careerId:id,questionId:q.id,skip:true});else for(const o of q.options.filter(o=>all||o.careerIds.includes(id)).slice(0,all?Infinity:1))if(!s.profileJourney.depth?.[spec.family]?.[q.id]?.includes(o.id))updateCareerCheck(s,{careerId:id,questionId:q.id,optionId:o.id});finishCareerCheckQuestion(s,id,q.id);}return spec;}
for(const [id,career] of [['gap-021','human-resources'],['gap-014','accounting'],['legacy-014','electrical-engineering']])test(id+': a focused professional comparison can earn Top status without changing fields or original scores',()=>{
 const c=raw(id),s=structuredClone(c.experimentState),scores=journeyInterestPicture(s).raw,beforeChoice=s.guide.primaryCareer,beforeField=s.profileJourney.family;
 assert.ok(!planMatchCandidates(s).top.some(r=>r.id===career));assert.ok(careerComparisonOptions(s).rows.some(r=>r.id===career));
 const spec=answerFor(s,career);assert.ok(careerCheckComplete(s,career));assert.ok(planMatchCandidates(s).top.some(r=>r.id===career),career);assert.equal(s.profileJourney.family,beforeField);assert.equal(s.guide.primaryCareer,beforeChoice);assert.deepEqual(journeyInterestPicture(s).raw,scores);
 const reloaded=sanitizeState(JSON.parse(JSON.stringify(s)));assert.ok(careerCheckComplete(reloaded,career));assert.deepEqual(planMatchCandidates(reloaded).top.map(r=>r.id),planMatchCandidates(s).top.map(r=>r.id));assert.deepEqual(reloaded.profileJourney.depth[beforeField],c.experimentState.profileJourney.depth[beforeField]);assert.ok(spec.questions.every(q=>q.kind==='core-work'||professionQuestions[spec.family].includes(q)));
});
test('degree willingness and high pay never create a Top match before work answers exist',()=>{
 const s=raw('gap-021').experimentState;s.profileJourney.answers.education=['graduate'];s.profileJourney.careerChecks={'human-resources':true};assert.ok(!planMatchCandidates(s).top.some(r=>r.id==='human-resources'));assert.equal(careerCheckComplete(s,'human-resources'),false);
 for(const skip of[true,false]){const copy=structuredClone(s);answerFor(copy,'human-resources',{all:!skip,skip});assert.ok(!planMatchCandidates(copy).top.some(r=>r.id==='human-resources'));}
});
test('education and first-paid-stage pay order only comparably supported candidates',()=>{
 const row=(id,score,pay)=>({id,o:occupationById(id),score,taskTotal:8,specificSupport:0,routeSupport:false,basis:'profile-and-tasks',interestMatch:{r:.8},firstPay:pay,meetsLifestyle:true});
 const candidates=[row('bookkeeping-clerk',8,38692),row('accounting',8,61339)];assert.equal(selectTopPlanMatches(candidates,3,{education:['college']})[0].id,'accounting');assert.equal(selectTopPlanMatches(candidates,3,{education:['training']})[0].id,'bookkeeping-clerk');
 assert.equal(selectTopPlanMatches([row('bookkeeping-clerk',8,38692),row('accounting',3,200000)],3,{education:['college']})[0].id,'bookkeeping-clerk');
 const prior=structuredClone(candidates);selectTopPlanMatches(candidates);assert.deepEqual(candidates,prior);
});
test('completed work from an earlier field and focused comparisons remain eligible after changing current field',()=>{
 const s=raw('gap-014').experimentState;answerFor(s,'accounting');answerFor(s,'bookkeeping-clerk');s.profileJourney.family='science';const top=planMatchCandidates(s).top;assert.ok(top.some(r=>r.id==='accounting'));assert.ok(top.some(r=>r.id==='bookkeeping-clerk'));
});
test('flat profiles and explicit clinical route conflicts retain their safeguards',()=>{
 for(const id of['legacy-023','legacy-024']){const s=raw(id).experimentState;assert.equal(careerComparisonOptions(s).rows.length,0);answerFor(s,'accounting');assert.equal(planMatchCandidates(s).top.length,0);}
 const s=raw('legacy-004').experimentState;assert.ok(!careerComparisonOptions(s).rows.some(r=>r.id==='physician'));assert.ok(!planMatchCandidates(s).top.some(r=>r.id==='physician'));
});
test('college remains visible as a future-work invitation when interests support a comparison',()=>{
 for(const id of['gap-021','gap-014','legacy-014']){const s=raw(id).experimentState,rows=careerComparisonOptions(s).rows.slice(0,3);assert.ok(rows.some(r=>educationRoutesFor(r.o).some(x=>['college','graduate'].includes(x.key))),id);const html=careerComparisonsPanel(s);assert.match(html,/Explore a wider range of professions/);assert.match(html,/Compare the work/);assert.doesNotMatch(html,/undefined|NaN/);}
});
test('focused questions validate options, persist partial answers and resume their own route',()=>{
 const s=raw('gap-021').experimentState,spec=careerCheckSpec('human-resources'),q=spec.questions[0],before=JSON.stringify(s);assert.equal(updateCareerCheck(s,{careerId:spec.id,questionId:q.id,optionId:'unknown-option'}),false);assert.equal(JSON.stringify(s),before);
 updateCareerCheck(s,{careerId:spec.id,questionId:q.id,optionId:q.options[0].id});s.profileJourney.lastRoute='journey/check-career/human-resources/1';const clean=sanitizeState(s);assert.equal(profileResume(clean),s.profileJourney.lastRoute);assert.equal(careerCheckComplete(clean,spec.id),false);assert.match(careerCheckPage(clean,spec.id,'1'),/Question 2 of/);
 const invalid=structuredClone(s);invalid.profileJourney.careerChecks={'bogus':true,'accounting':'true'};assert.deepEqual(sanitizeState(invalid).profileJourney.careerChecks,{});
});
test('developer comparisons alter a copy and never the frozen source model',()=>{
 const c=raw('gap-021'),before=JSON.stringify(c),s=studentModelState(c);answerFor(s,'human-resources');assert.match(studentModelScreen(s,'journey/check-career/human-resources/summary'),/now among your Top matches/);assert.equal(JSON.stringify(c),before);
});
