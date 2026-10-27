// Historical funnel UI assertions retained for pre-0.53 behavior; current flow is tested in open-explorer-053.test.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,sanitizeState} from '../dist/model.js';
import {profileQuestions,skillResponseOptions,saveProfileAnswer,questionAnswered,advanceProfile,skillExperienceFamiliar,skillExperienceNeedsSupport,broadSuggestions,professionSuggestions} from '../dist/profile-journey.js';
import {historicalProfileJourneyPage as profileJourneyPage} from '../dist/profile-journey-ui.js';
import {personalPlanExport} from '../dist/guide-state.js';

const q=profileQuestions.find(q=>q.kind==='skill');
test('each single response saves, completes, advances, and survives reload and export',()=>{
 for(const o of skillResponseOptions){
  const s=freshState();s.profileJourney.started=true;s.profileJourney.reviewSection='skill';s.profileJourney.index=profileQuestions.indexOf(q);
  assert.equal(questionAnswered(s,q),false);
  assert.equal(saveProfileAnswer(s,q,o.id),true);
  assert.equal(questionAnswered(s,q),true);
  assert.deepEqual(s.profileJourney.skills[q.id],{level:o.id});
  assert.equal(advanceProfile(s),'journey/profile');
  assert.equal(s.profileJourney.index,profileQuestions.indexOf(q)+1);
  const r=sanitizeState(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(r.profileJourney.skills[q.id],{level:o.id});
  assert.deepEqual(personalPlanExport(r).guidedProfile.skillExperience[q.id],{level:o.id});
  r.profileJourney.index--;
  assert.ok(profileJourneyPage('journey/profile',r).includes(`data-value="${o.id}" aria-pressed="true"`));
 }
});
test('earlier paired responses remain complete without inventing a new selection',()=>{
 const s=freshState();s.profileJourney.version='5.0.0';s.profileJourney.index=100;
 s.profileJourney.skills[q.id]={practice:'often',confidence:4};
 s.curiosity['curiosity-1']=5;s.actions=[{id:'keep',title:'Keep this step',done:true,notice:'My note'}];
 const r=sanitizeState(JSON.parse(JSON.stringify(s)));
 assert.equal(r.profileJourney.index,100);
 assert.deepEqual(r.profileJourney.skills[q.id],{practice:'often',confidence:4});
 assert.equal(questionAnswered(r,q),true);
 assert.equal(r.curiosity['curiosity-1'],5);assert.equal(r.actions[0].notice,'My note');assert.equal(r.actions[0].done,true);
 saveProfileAnswer(r,q,'new');
 assert.deepEqual(r.profileJourney.skills[q.id],{practice:'often',confidence:4,level:'new'});
 assert.equal(skillExperienceFamiliar(r.profileJourney.skills[q.id]),false);
 assert.equal(skillExperienceNeedsSupport(r.profileJourney.skills[q.id]),true);
});
test('invalid choices and partial legacy answers cannot count as completed',()=>{
 const s=freshState();s.profileJourney.skills[q.id]={practice:'often'};
 assert.equal(questionAnswered(s,q),false);
 assert.equal(saveProfileAnswer(s,q,'expert'),false);
 s.profileJourney.skills[q.id].level='expert';
 assert.equal(questionAnswered(sanitizeState(s),q),false);
});
test('experience choices change support context without changing career rankings',()=>{
 const s=freshState();s.profileJourney.family='health';
 const broad=broadSuggestions(s),roles=professionSuggestions(s).rows.map(r=>[r.o.id,r.score]);
 for(const o of skillResponseOptions){
  saveProfileAnswer(s,q,o.id);
  assert.deepEqual(broadSuggestions(s),broad);
  assert.deepEqual(professionSuggestions(s).rows.map(r=>[r.o.id,r.score]),roles);
  assert.equal(skillExperienceFamiliar(s.profileJourney.skills[q.id]),['independent','teach'].includes(o.id));
  assert.equal(skillExperienceNeedsSupport(s.profileJourney.skills[q.id]),['new','supported'].includes(o.id));
 }
});
