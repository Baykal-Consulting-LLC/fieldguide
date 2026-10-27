import test from 'node:test';
import assert from 'node:assert/strict';
import {curiosity,confidence,challenges,modules,directions} from '../dist/content.js';
import {freshState,sanitizeState,moduleStatus,isComplete,completedCount,likedActivities,unknownActivities,movePriority,addDirectionAction,toggleDirection,escapeHTML} from '../dist/model.js';

test('unanswered and unfamiliar activities never become low preferences',()=>{
  const s=freshState();s.curiosity[curiosity[0].id]='untried';s.curiosity[curiosity[1].id]=1;s.curiosity[curiosity[2].id]=5;
  assert.equal(moduleStatus(s,'curiosity').done,3);
  assert.deepEqual(likedActivities(s).map(q=>q.id),[curiosity[2].id]);
  assert.deepEqual(unknownActivities(s).map(q=>q.id),[curiosity[0].id]);
  assert.equal(isComplete(s,'curiosity'),false);
});
test('confidence requires both answers and remains independent of exposure',()=>{
  const s=freshState();s.confidence[confidence[0].id]={exposure:'new',confidence:5};s.confidence[confidence[1].id]={exposure:'often'};
  assert.equal(moduleStatus(s,'confidence').done,1);
  const restored=sanitizeState(s);assert.equal(restored.confidence[confidence[0].id].confidence,5);assert.equal(restored.confidence[confidence[1].id].confidence,undefined);
});
test('saved state retains valid zero-index challenge answers',()=>{
  const s=freshState();s.challenges[challenges[0].id]=0;
  assert.equal(sanitizeState(s).challenges[challenges[0].id],0);
  assert.equal(moduleStatus(s,'challenges').done,1);
});
test('malformed persisted data cannot inflate completion or introduce unknown records',()=>{
  const raw={...freshState(),curiosity:{'curiosity-1':500,'curiosity-2':'untried',unknown:5},priorities:['impact','impact','unknown','creativity','mastery','stability'],challenges:{quantitative:99},savedDirections:['design','design','unknown'],actions:[null,{id:'a',title:'',done:true},{id:'b',title:'Try this',done:'true'}]};
  const s=sanitizeState(raw);assert.equal(moduleStatus(s,'curiosity').done,1);assert.deepEqual(s.priorities,['impact','creativity','mastery']);assert.deepEqual(s.savedDirections,['design']);assert.equal(s.actions.length,1);assert.equal(s.actions[0].done,false);assert.equal(moduleStatus(s,'challenges').done,0);
  assert.deepEqual(sanitizeState({version:999}),freshState());assert.deepEqual(sanitizeState(null),freshState());
});
test('completion is recalculated from responses and can be undone',()=>{
  const s=freshState();for(const q of curiosity)s.curiosity[q.id]='untried';s.priorities=['impact','creativity','mastery'];for(const q of confidence)s.confidence[q.id]={exposure:'new',confidence:1};for(const q of challenges)s.challenges[q.id]=q.answer;s.evidence.project='School project';s.reflection.energy='Building something';
  assert.equal(completedCount(s),modules.length);delete s.curiosity[curiosity[0].id];assert.equal(completedCount(s),modules.length-1);s.evidence.project='';assert.equal(completedCount(s),modules.length-2);
});
test('priority movement respects bounds and preserves the chosen order',()=>{
  const s=freshState();s.priorities=['impact','creativity','mastery'];movePriority(s,'impact',-1);assert.deepEqual(s.priorities,['impact','creativity','mastery']);movePriority(s,'mastery',-1);assert.deepEqual(s.priorities,['impact','mastery','creativity']);movePriority(s,'unknown',1);assert.deepEqual(s.priorities,['impact','mastery','creativity']);
});
test('direction experiments are added once and bookmarks persist independently',()=>{
  const s=freshState();assert.equal(addDirectionAction(s,'design'),true);assert.equal(addDirectionAction(s,'design'),false);assert.equal(addDirectionAction(s,'unknown'),false);assert.equal(s.actions.length,1);toggleDirection(s,'design');toggleDirection(s,'technology');toggleDirection(s,'design');assert.deepEqual(s.savedDirections,['technology']);assert.equal(s.actions.length,1);
});
test('planner keeps new career experiment fields while retaining legacy actions',()=>{
  const s=freshState();s.actions=[{id:'old',title:'Old saved action',detail:'Legacy detail',done:true},{id:'new',title:'Ask about a supervised visit',detail:'Notice the work setting.',done:false,dueDate:'2026-11-01',support:'Ask counselor first',notice:'Do not attempt regulated work',learned:'',enjoyed:'',difficult:'',surprising:'',continueDecision:'',careerId:'psychiatric-aide'}];
  const restored=sanitizeState(s);assert.deepEqual(restored.actions[0],s.actions[0]);assert.deepEqual(restored.actions[1],s.actions[1]);
});
test('user text is escaped before being interpolated into the interface',()=>{
  assert.equal(escapeHTML('<img src=x onerror="alert(1)"> & \'hello\''),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;hello&#39;');
});
test('challenge answer keys and editorial direction IDs are internally consistent',()=>{
  assert.equal(30+10*4,10+10*6);assert.equal(challenges.find(q=>q.id==='quantitative').options[1],'10 notebooks');assert.equal(challenges.find(q=>q.id==='logical').options[1],'Biology');assert.equal(challenges.find(q=>q.id==='spatial').answer,1);
  for(const q of challenges){assert.ok(q.answer>=0&&q.answer<q.options.length);assert.ok(q.rationale.length>30);}
  assert.equal(new Set(directions.map(d=>d.id)).size,directions.length);
});
