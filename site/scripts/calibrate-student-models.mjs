import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {studentModels,studentModelMetadata,studentModelInvariants,buildStudentModelState} from '../calibration/student-models-032.js';
import {matchingEngineVersion,onetQuestions} from '../dist/onet-assessment.js';
import {profileQuestions,freshProfileJourney,orderedProfileQuestions,profileComplete,questionAnswered,firstUnansweredProfileIndex,saveProfileAnswer,advanceProfile,beginProfileFollowups,beginProfileSection,broadSuggestions,professionSuggestions,journeyInterestPicture,makeJourneyPlan} from '../dist/profile-journey.js';
import {professionQuestions} from '../dist/profession-questions.js';
import {sanitizeState} from '../dist/model.js';
import {buildLifestyleInputs} from '../dist/lifestyle-builder.js';
import {personalPlanExport,requiredGross} from '../dist/guide-state.js';
import {studentReviewInputs,studentReviewPlan} from './student-review-details.mjs';

const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const sorted=x=>Array.isArray(x)?x.map(sorted):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sorted(x[k])])):x;
export function frozenPayloadHash(){
 const keys=['id','officialAnswers','fieldPreferences','skills','priorities','context','depth','selectedFamily','lifestyle','reviewTargets'];
 return hash(JSON.stringify(sorted(studentModels.map(s=>Object.fromEntries(keys.map(k=>[k,s[k]]))))).replace(/[^\x00-\x7f]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0')));
}
const summary=s=>{const p=journeyInterestPicture(s),b=broadSuggestions(s),r=professionSuggestions(s);return {sixScores:p.raw,flat:p.flat,nearFlat:p.nearFlat,pathways:b.fields.map(f=>({id:f.id,title:f.title,correlation:f.connection.score,reasons:f.connection.reasons})),taskPathways:b.workFields.map(f=>({id:f.id,title:f.title})),careerStatus:r.status,careers:r.top.map(x=>({id:x.o.id,title:x.o.title,correlation:x.interestMatch.r,basis:x.basis,reasons:x.reasons,taskQuestions:x.score,domains:x.domains})),otherSupported:r.rows.filter(x=>x.supported&&!r.top.some(t=>t.o.id===x.o.id)).map(x=>({id:x.o.id,title:x.o.title,reasons:x.reasons})),taskLeads:r.taskLeads.map(x=>({id:x.o.id,title:x.o.title,reasons:x.reasons})),conflicts:r.rows.filter(x=>x.routeConflict&&x.specificSupport>=2).map(x=>({id:x.o.id,title:x.o.title,reason:'Liked the role’s duties, but chose a different training route.'}))};};
const ranking=s=>{const r=summary(s);return {sixScores:r.sixScores,pathways:r.pathways.map(x=>x.id),careers:r.careers.map(x=>x.id)};};

export function answerCore(s,reference,trace){
 for(let guard=0;!profileComplete(s)&&guard<140;guard++){
  const index=firstUnansweredProfileIndex(s);assert.ok(index>=0,'Missing required question is reachable');
  s.profileJourney.index=index;const q=orderedProfileQuestions(s)[index];
  if(q.kind==='values'){s.priorities=[...reference.priorities];s.profileJourney.answers.values=true;}
  else if(q.kind==='context'&&q.multi)s.profileJourney.answers[q.id]=structuredClone(reference.profileJourney.answers[q.id]);
  else {const value=q.kind==='interest'?reference.profileJourney.officialInterest.answers[q.id]:q.kind==='pathway'?reference.profileJourney.fieldPreferences[q.id]:q.kind==='skill'?reference.profileJourney.skills[q.id].level:reference.profileJourney.answers[q.id];assert.ok(saveProfileAnswer(s,q,value),q.id);}
  assert.ok(questionAnswered(s,q));trace.questions.push(q.id);
  const route=advanceProfile(s);trace.routes.push(route);
  if(route==='journey/profile-followups')beginProfileFollowups(s);
  for(const [path,kind]of [['journey/profile-experience','skill'],['journey/profile-priorities','values'],['journey/profile-working-life','context']])if(route===path)beginProfileSection(s,kind);
 }
 assert.ok(profileComplete(s),'Core journey terminates');
}

export async function runStudentModels(){
 assert.equal(frozenPayloadHash(),studentModelMetadata.answerPayloadSHA256,'Frozen narrative answers/targets were not changed after observing outcomes');
 const report={release:'0.32.0',engine:matchingEngineVersion,createdAt:new Date().toISOString(),scope:'24 authored fictional students, frozen before first recommendation run. Scenario-based consistency and engineering checks; no human validation or accuracy percentage.',fixture:studentModelMetadata,invariants:studentModelInvariants,students:[],failures:[]};
 for(const spec of studentModels){
  const reference=await buildStudentModelState(spec),s=structuredClone(reference),trace={questions:[],routes:['journey/lifestyle','journey/profile-intro']};
  s.profileJourney=freshProfileJourney();s.profileJourney.started=true;s.profileJourney.introSeen=true;s.priorities=[];
  answerCore(s,reference,trace);
  assert.deepEqual(trace.questions.filter(id=>id.startsWith('onet-sf-')),onetQuestions.map(q=>q.id));
  const firstResults=summary(s);s.profileJourney.family=spec.selectedFamily;s.profileJourney.families=[spec.selectedFamily];
  answerCore(s,reference,trace); // A freely chosen field may need one setting answer.
  s.profileJourney.professionIntrosSeen=[spec.selectedFamily];
  const followups=professionQuestions[spec.selectedFamily];s.profileJourney.depth[spec.selectedFamily]={};
  for(const [i,q]of followups.entries()){
   s.profileJourney.depthIndexes[spec.selectedFamily]=i;
   const answers=spec.depth[spec.selectedFamily][q.id];assert.ok(Array.isArray(answers));
   assert.ok(answers.every(id=>q.options.some(o=>o.id===id)));s.profileJourney.depth[spec.selectedFamily][q.id]=[...answers];
  }
  const core=summary(s),expected=ranking(s),checks=[];
  const novice=structuredClone(s);for(const q of profileQuestions.filter(q=>q.kind==='skill'))novice.profileJourney.skills[q.id]={level:'new'};
  assert.deepEqual(ranking(novice),expected);checks.push('Low experience does not change interests or career rankings');
  const expensive=structuredClone(s);for(const key of Object.keys(expensive.guide.lifestyleBuilder.choices))expensive.guide.lifestyleBuilder.choices[key]=4;
  expensive.finance.lifestyle=buildLifestyleInputs(expensive.guide.lifestyleBuilder,expensive.finance.lifestyle);
  assert.deepEqual(ranking(expensive),expected);checks.push('A more expensive lifestyle changes money needs, not interest matching');
  const restored=sanitizeState(JSON.parse(JSON.stringify(s)));assert.deepEqual(ranking(restored),expected);checks.push('Answers and recommendations survive save/reload');
  assert.ok(core.pathways.length<=3&&core.careers.length<=3);if(core.flat||core.nearFlat){assert.equal(core.careers.length,0);assert.equal(core.pathways.length,0);}checks.push('Open profiles do not force three pathways or a profession');
  if(spec.reviewTargets.routeConflict)assert.ok(core.conflicts.length,'Authored medical route disagreement remains visible');
  const enriched=structuredClone(s);enriched.profileJourney.fieldPreferences=structuredClone(reference.profileJourney.fieldPreferences);enriched.profileJourney.skills=structuredClone(reference.profileJourney.skills);enriched.profileJourney.answers=structuredClone(reference.profileJourney.answers);
  const optional=summary(enriched);assert.deepEqual(optional.sixScores,core.sixScores);checks.push('Optional detail preserves all six official interest scores');
  s.actions=[{id:'model-earlier-step',title:'My earlier activity',detail:spec.observedContext,notice:'Keep what I learned before choosing a direction.',done:true}];
  s.careerLibrary.notes[spec.reviewTargets.rolesToInspect[0]||'writing']='An earlier reading note stays saved.';
  const inputs=studentReviewInputs(s);let plan=null,planExport=null,planChoice='No career assigned. The student can inspect any job in the chosen field.';
  const visibleIds=[...core.careers,...core.otherSupported,...core.taskLeads].map(c=>c.id),chosenRole=spec.reviewTargets.rolesToInspect.find(id=>visibleIds.includes(id));
  if(chosenRole){
   assert.ok(makeJourneyPlan(s,chosenRole));
   const saved=sanitizeState(JSON.parse(JSON.stringify(s)));assert.ok(saved.actions.some(a=>a.id==='model-earlier-step'&&a.done&&a.notice));assert.deepEqual(journeyInterestPicture(saved).raw,core.sixScores);
   plan=studentReviewPlan(s);planExport=personalPlanExport(s);planChoice='The harness exercises the first prewritten role to inspect that is visible in the results, including named alternatives. This explicit fictional choice does not change the ranking or establish a correct career.';
   checks.push('Plan creation preserves earlier completed work, notes and official answers');
  }
  const skipped=profileQuestions.filter(q=>!trace.questions.includes(q.id)).map(q=>q.id);
  report.students.push({id:spec.id,name:spec.name,grade:spec.grade,narrative:spec.narrative,observedContext:spec.observedContext,unmeasuredLimits:spec.unmeasuredLimits,tags:spec.tags,reviewTargets:spec.reviewTargets,selectedFamily:spec.selectedFamily,selectedFamilyWasSuggested:firstResults.pathways.some(f=>f.id===spec.selectedFamily),firstResults,core,optional,optionalChanges:{pathways:JSON.stringify(core.pathways.map(x=>x.id))!==JSON.stringify(optional.pathways.map(x=>x.id)),careers:JSON.stringify(core.careers.map(x=>x.id))!==JSON.stringify(optional.careers.map(x=>x.id))},route:trace,requiredProfileScreens:trace.questions.length,totalChoiceScreens:9+trace.questions.length+followups.length,skippedOptionalQuestionIds:skipped,inputs,checks,review:{targetFamilyFeatured:spec.reviewTargets.acceptableFamilies.some(id=>firstResults.pathways.some(f=>f.id===id)),targetRoleFeatured:spec.reviewTargets.rolesToInspect.some(id=>core.careers.some(c=>c.id===id)),interpretation:'Targets identify cases for review, not a success denominator. No answers were altered after seeing matches.'},planChoice,plan,planExport,experimentState:structuredClone(s),authoredAnswers:{official:spec.officialAnswers,field:spec.fieldPreferences,experience:spec.skills,priorities:spec.priorities,context:spec.context,depth:spec.depth,lifestyle:spec.lifestyle},incomeGoal:requiredGross(reference.finance.lifestyle)});
 }
 report.coverage={students:report.students.length,families:new Set(report.students.map(s=>s.selectedFamily)).size,distinctSixScoreProfiles:new Set(report.students.map(s=>s.core.sixScores.join(','))).size,officialAnswers:studentModels.length*60,totalChoiceScreens:{min:Math.min(...report.students.map(s=>s.totalChoiceScreens)),max:Math.max(...report.students.map(s=>s.totalChoiceScreens))},optionalCareerChanges:report.students.filter(s=>s.optionalChanges.careers).map(s=>s.id),reviewFlags:report.students.filter(s=>s.reviewTargets.rolesToInspect.length&&!s.review.targetRoleFeatured).map(s=>s.id),checks:report.students.reduce((n,s)=>n+s.checks.length,0)};
 return report;
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const report=await runStudentModels();
 fs.writeFileSync('validation/student-models-032-2026-10-18.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({coverage:report.coverage,students:report.students.map(s=>({id:s.id,scores:s.core.sixScores,pathways:s.firstResults.pathways.map(x=>x.id),careers:s.core.careers.map(x=>x.id),optional:s.optional.careers.map(x=>x.id),screens:s.totalChoiceScreens,review:s.review.targetRoleFeatured,conflicts:s.core.conflicts.map(c=>c.id)}))},null,2));
}
