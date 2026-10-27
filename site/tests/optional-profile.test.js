// Historical funnel UI assertions retained for pre-0.53 behavior; current flow is tested in open-explorer-053.test.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import {walkthroughState} from '../dist/journey-walkthroughs.js';
import {sanitizeState} from '../dist/model.js';
import {profileQuestions,requiredProfileQuestions,profileNavigationQuestions,profileComplete,questionAnswered,nextProfileIndex,advanceProfile,beginProfileReview,finishProfileReview,profileResume,broadSuggestions,journeyInterestPicture,beginProfileSection,backFromProfileSection} from '../dist/profile-journey.js';
import {historicalProfileJourneyPage as profileJourneyPage} from '../dist/profile-journey-ui.js';

test('the short route retains all official items, broad coverage and two daily-work clues for supported fields',()=>{
 for(const id of ['medicine','creative','trades']){
  const s=walkthroughState(id),before=journeyInterestPicture(s).raw;
  s.profileJourney.skills={};for(const key of ['company','rhythm','setting'])delete s.profileJourney.answers[key];
  const required=requiredProfileQuestions(s);
  assert.equal(required.filter(q=>q.kind==='interest').length,60);
  assert.equal(required.filter(q=>q.kind==='pathway'&&q.facet==='activity').length,12);
  assert.equal(required.filter(q=>q.kind==='skill'||q.facet==='routine').length,0);
  assert.deepEqual(required.filter(q=>q.kind==='context').map(q=>q.id),['education']);
  for(const q of profileQuestions)if(!required.some(x=>x.id===q.id))delete s.profileJourney.fieldPreferences[q.id];
  assert.ok(profileComplete(s));assert.deepEqual(journeyInterestPicture(s).raw,before);
  assert.ok(broadSuggestions(s).fields.length>0);
  assert.ok(broadSuggestions(s).fields.every(f=>f.connection.focused.likes.length>=2));
  assert.ok(required.length<=86);
 }
});
test('optional experience review saves, resumes and exits without gating an existing plan',()=>{
 const s=walkthroughState('creative',{plan:true});s.actions[0].done=true;s.actions[0].notice='Keep my design notes';
 const scores=journeyInterestPicture(s).raw,paths=broadSuggestions(s).fields.map(f=>f.id),first=profileQuestions.findIndex(q=>q.kind==='skill');
 s.profileJourney.skills={};assert.ok(profileComplete(s));assert.ok(beginProfileReview(s,first));
 assert.equal(profileNavigationQuestions(s).length,12);assert.equal(beginProfileSection(s,'skill'),'journey/profile');
 s.profileJourney.skills[profileQuestions[first].id]={level:'supported'};advanceProfile(s);
 const restored=sanitizeState(JSON.parse(JSON.stringify(s)));assert.equal(restored.profileJourney.reviewSection,'skill');assert.equal(profileResume(restored),'journey/profile');
 assert.ok(profileComplete(restored));assert.deepEqual(journeyInterestPicture(restored).raw,scores);assert.deepEqual(broadSuggestions(restored).fields.map(f=>f.id),paths);
 assert.equal(restored.actions[0].notice,'Keep my design notes');assert.equal(restored.actions[0].done,true);
 assert.match(profileJourneyPage('journey/profile',restored),/Save &amp; return|Save & return/);
 assert.equal(finishProfileReview(restored),'journey/profile-review');assert.equal(restored.profileJourney.reviewSection,'');assert.ok(restored.profileJourney.skills[profileQuestions[first].id]);
});
test('completing or backing out of an optional section returns to the profile without replaying the main journey',()=>{
 const s=walkthroughState('medicine'),first=profileQuestions.findIndex(q=>q.kind==='skill');
 assert.ok(beginProfileReview(s,first));assert.equal(backFromProfileSection(s,'skill'),'journey/profile-review');
 assert.ok(beginProfileReview(s,first));s.profileJourney.index=profileQuestions.findLastIndex(q=>q.kind==='skill');
 assert.equal(nextProfileIndex(s,s.profileJourney.index),-1);assert.equal(advanceProfile(s),'journey/profile-review');assert.ok(profileComplete(s));
});
test('expanded mode retains the full bank and malformed optional-section identifiers are rejected',()=>{
 const s=walkthroughState('medicine');s.profileJourney.questionMode='all';s.profileJourney.skills={};
 assert.equal(requiredProfileQuestions(s).length,113);assert.equal(profileComplete(s),false);
 s.profileJourney.reviewSection='<script>';assert.equal(sanitizeState(s).profileJourney.reviewSection,'');
 assert.equal(beginProfileReview(s,96),false);
});
