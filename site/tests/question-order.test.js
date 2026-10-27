import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,sanitizeState} from '../dist/model.js';
import {createProfileQuestionOrder,validProfileQuestionOrder,orderedProfileQuestions,ensureProfileQuestionOrder,profileQuestions,saveProfileAnswer,advanceProfile,broadSuggestions,professionSuggestions} from '../dist/profile-journey.js';
import {walkthroughState} from '../dist/journey-walkthroughs.js';
const randomFor=seed=>()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);

test('balanced orders cover every question once, official sequence intact, and every field in each twelve',()=>{
 for(let seed=1;seed<=64;seed++){
  const order=createProfileQuestionOrder(randomFor(seed));assert.equal(validProfileQuestionOrder(order),true);
  const s=freshState();s.profileJourney.questionOrder=order;const qs=orderedProfileQuestions(s);
  assert.deepEqual(qs.slice(0,60).map(q=>q.id),profileQuestions.slice(0,60).map(q=>q.id));
  for(let i=61;i<96;i++)assert.notEqual(qs[i].family,qs[i-1].family);
  assert.ok(qs.slice(96,108).every(q=>q.kind==='skill'));
  assert.deepEqual(qs.slice(108).map(q=>q.id),profileQuestions.slice(108).map(q=>q.id));
 }
});
test('new order and ID-based answers survive backtracking, reload and repeated resume',()=>{
 const s=freshState();const first=ensureProfileQuestionOrder(s,randomFor(17));s.profileJourney.started=true;
 assert.notDeepEqual(first.map(q=>q.id),profileQuestions.map(q=>q.id));
 saveProfileAnswer(s,first[0],5);advanceProfile(s);saveProfileAnswer(s,first[1],2);advanceProfile(s);s.profileJourney.index--;
 const r=sanitizeState(JSON.parse(JSON.stringify(s)));assert.equal(orderedProfileQuestions(r)[r.profileJourney.index].id,first[1].id);
 assert.deepEqual(ensureProfileQuestionOrder(r,randomFor(98)).map(q=>q.id),first.map(q=>q.id));
 assert.deepEqual(r.curiosity,s.curiosity);assert.deepEqual(r.profileJourney.interests,s.profileJourney.interests);assert.deepEqual(r.profileJourney.officialInterest,s.profileJourney.officialInterest);
});
test('a journey already underway keeps its original order and current question',()=>{
 const s=walkthroughState('medicine',{plan:true});s.profileJourney.version='6.0.0';delete s.profileJourney.questionOrder;s.profileJourney.index=98;
 const r=sanitizeState(JSON.parse(JSON.stringify(s)));const before={actions:r.actions,curiosity:r.curiosity,skills:r.profileJourney.skills,career:r.guide.primaryCareer};
 ensureProfileQuestionOrder(r,randomFor(17));
 assert.deepEqual(r.profileJourney.questionOrder,profileQuestions.map(q=>q.id));assert.equal(orderedProfileQuestions(r)[r.profileJourney.index].id,profileQuestions[98].id);
 assert.deepEqual({actions:r.actions,curiosity:r.curiosity,skills:r.profileJourney.skills,career:r.guide.primaryCareer},before);
});
test('question order does not change completed-profile pathway or profession results',()=>{
 for(const story of ['medicine','creative','trades']){
  const s=walkthroughState(story),before=broadSuggestions(s),roles=professionSuggestions(s);
  s.profileJourney.questionOrder=createProfileQuestionOrder(randomFor(117));
  assert.deepEqual(broadSuggestions(s),before);assert.deepEqual(professionSuggestions(s),roles);
 }
});
test('end-of-profile repair returns to the missing question in the saved order',()=>{
 const s=walkthroughState('creative');s.profileJourney.questionOrder=createProfileQuestionOrder(randomFor(71));
 const qs=orderedProfileQuestions(s),missing=qs.findIndex(q=>q.id==='onet-sf-10');delete s.profileJourney.officialInterest.answers['onet-sf-10'];s.profileJourney.index=qs.length-1;
 assert.equal(advanceProfile(s),'journey/profile');assert.equal(s.profileJourney.index,missing);
});
test('invalid, duplicate and cross-section orders cannot change displayed question identity',()=>{
 const canonical=profileQuestions.map(q=>q.id);
 for(const mutate of [a=>a.pop(),a=>a[0]='unknown',a=>a[0]=a[1],a=>[a[0],a[96]]=[a[96],a[0]]]){
  const s=freshState(),order=[...canonical];mutate(order);assert.equal(validProfileQuestionOrder(order),false);s.profileJourney.questionOrder=order;
  assert.deepEqual(orderedProfileQuestions(s),profileQuestions);assert.deepEqual(sanitizeState(s).profileJourney.questionOrder,[]);
 }
});
