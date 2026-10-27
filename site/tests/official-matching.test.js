// Historical funnel UI assertions retained for pre-0.53 behavior; current flow is tested in open-explorer-053.test.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {onetQuestions,onetResponseOptions,onetInstrument,scoreOnetInterest,profileCorrelation,interestFit,cleanOnetInterest} from '../dist/onet-assessment.js';
import {freshState,sanitizeState} from '../dist/model.js';
import {walkthroughState} from '../dist/journey-walkthroughs.js';
import {careerInterestMatch,professionSuggestions,broadSuggestions,journeyFieldConnection,makeJourneyPlan,resolveJourneyRoute} from '../dist/profile-journey.js';
import {occupationById,occupations} from '../dist/occupation-data.js';
import {professionQuestions} from '../dist/profession-questions.js';
import {historicalProfileJourneyPage as profileJourneyPage} from '../dist/profile-journey-ui.js';

const uniform=(s,v)=>{for(const q of onetQuestions)s.profileJourney.officialInterest.answers[q.id]=v;};
test('the official source snapshot, item order, wording and response labels are reproduced exactly',()=>{
 const source=JSON.parse(fs.readFileSync(new URL('../data-sources/onet-short-form-60-official.json',import.meta.url))).response;
 assert.deepEqual(onetQuestions.map(q=>({index:q.index,area:{R:'realistic',I:'investigative',A:'artistic',S:'social',E:'enterprising',C:'conventional'}[q.theme],text:q.text})),source.question);
 assert.deepEqual(onetResponseOptions.map(o=>({value:o.value,name:o.label})),source.answer_option);
 assert.equal(onetQuestions.length,60);assert.match(onetInstrument.licenseURL,/by-nd/);
});
test('missing, malformed and wrong-instrument answers cannot create official scores',()=>{
 const s=walkthroughState('medicine');delete s.profileJourney.officialInterest.answers[onetQuestions[0].id];
 assert.equal(scoreOnetInterest(s).complete,false);assert.equal(careerInterestMatch(s,occupationById('physician')).r,null);assert.equal(professionSuggestions(s).top.length,0);
 s.profileJourney.officialInterest.answers[onetQuestions[0].id]='5';assert.equal(scoreOnetInterest(s).complete,false);
 assert.deepEqual(cleanOnetInterest({instrument:'custom',version:onetInstrument.version,answers:{'onet-sf-01':5}}).answers,{});
});
test('raw scores use 0–40 per dimension, without percentiles, prorating or hidden default answers',()=>{
 const s=walkthroughState('medicine');for(const [response,raw] of [[1,0],[3,20],[5,40]]){uniform(s,response);const p=scoreOnetInterest(s);assert.deepEqual(p.raw,[raw,raw,raw,raw,raw,raw]);assert.equal(p.flat,true);assert.equal(professionSuggestions(s).top.length,0);}
 const html=profileJourneyPage('journey/pathways',s);assert.match(html,/40 \/ 40/);assert.match(html,/show interests, not skills/);
});
test('full-six correlation uses lower dimensions, is invariant to linear scaling, and handles flat profiles',()=>{
 assert.equal(profileCorrelation([0,1,2,3,4,5],[0,1,2,3,4,5]),1);
 assert.equal(profileCorrelation([0,1,2,3,4,5],[5,4,3,2,1,0]),-1);
 assert.equal(profileCorrelation([0,1,2,3,4,5],[10,12,14,16,18,20]),1);
 assert.equal(profileCorrelation([3,3,3,3,3,3],[1,2,3,4,5,6]),null);
 assert.ok(profileCorrelation([5,4,3,2,1,0],[5,4,3,0,1,2])<1);
 assert.equal(interestFit(.729).tier,3);assert.equal(interestFit(.608).tier,2);assert.equal(interestFit(-.01).tier,0);
});
test('all direct occupational profiles are compared without inventing missing values',()=>{
 const s=walkthroughState('medicine'),matches=occupations.map(o=>careerInterestMatch(s,o));
 assert.equal(matches.filter(m=>m.status==='compared').length,116);
 const tattoo=careerInterestMatch(s,occupationById('tattoo'));assert.equal(tattoo.status,'missing');assert.equal(tattoo.r,null);assert.equal(tattoo.eligible,false);
});
test('one unusual answer among otherwise identical answers is insufficient for featured career recommendations',()=>{
 const s=walkthroughState('medicine');uniform(s,3);s.profileJourney.officialInterest.answers['onet-sf-03']=5;
 assert.equal(scoreOnetInterest(s).nearFlat,true);assert.ok(broadSuggestions(s).fields.every(f=>!f.supported));assert.equal(professionSuggestions(s).top.length,0);
});
test('follow-up choices refine matches while strong repeated task choices remain visible with their conflicting profile',()=>{
 const s=walkthroughState('creative');const before=careerInterestMatch(s,occupationById('graphic-design')).r;
 assert.ok(professionSuggestions(s).top.some(r=>r.o.id==='graphic-design'));
 for(const q of onetQuestions)s.profileJourney.officialInterest.answers[q.id]=q.theme==='S'?5:1;
 const r=professionSuggestions(s),design=r.rows.find(r=>r.o.id==='graphic-design');assert.ok(design.score>=3);assert.equal(design.supported,true);assert.equal(design.interestMatch.eligible,false);assert.equal(design.basis,'tasks');assert.equal(design.interestContrast,true);assert.ok(r.top.some(r=>r.o.id==='graphic-design'));
 assert.ok(makeJourneyPlan(s,'graphic-design'),'explicit exploration choices remain available');
 const t=walkthroughState('creative');t.profileJourney.depth.creative=Object.fromEntries(professionQuestions.creative.map(q=>[q.id,[]]));assert.equal(careerInterestMatch(t,occupationById('graphic-design')).r,before);assert.equal(professionSuggestions(t).top.length,0);
});
test('old custom answers, plan, notes and completed actions survive but are never relabeled official',()=>{
 const s=walkthroughState('creative',{plan:true});s.profileJourney.version='5.1.0';delete s.profileJourney.officialInterest;s.profileJourney.interests={'profile-interest-31':5};s.curiosity={'curiosity-1':4};s.actions[0].done=true;s.actions[0].notice='Keep my design note';s.profileJourney.index=72;
 const r=sanitizeState(JSON.parse(JSON.stringify(s)));assert.deepEqual(r.profileJourney.officialInterest.answers,{});assert.equal(r.profileJourney.legacyAssessment.index,72);assert.equal(r.profileJourney.legacyAssessment.version,'5.1.0');assert.deepEqual(r.curiosity,s.curiosity);assert.deepEqual(r.profileJourney.interests,s.profileJourney.interests);assert.equal(r.actions[0].notice,'Keep my design note');assert.equal(r.actions[0].done,true);assert.equal(r.guide.primaryCareer,'graphic-design');assert.equal(resolveJourneyRoute(r,'plan'),'plan');assert.equal(resolveJourneyRoute(r,'journey/pathways'),'journey/profile');assert.equal(professionSuggestions(r).top.length,0);
});
test('work preferences can refine pathway presentation within a fit category without changing correlations',()=>{
 const s=walkthroughState('trades'),before=journeyFieldConnection(s,'building');for(const q of Object.keys(s.profileJourney.fieldPreferences))if(q.startsWith('field-profile-building-'))s.profileJourney.fieldPreferences[q]=5;
 const after=journeyFieldConnection(s,'building');assert.equal(before.score,after.score);assert.deepEqual(before.baseRoles,after.baseRoles);assert.equal(after.focused.confirmed,true);
});
