import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {currentModelStates} from '../scripts/current-model-states.mjs';
import {replayBroadFollowups052} from '../dist/broad-followups-052-replay.js';
import {planMatchCandidates} from '../dist/plan-matches.js';
import {followup052Table,followup052Trail} from '../dist/broad-followups-052-ui.js';
const read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),root='research/broad-followups-052/';
test('question, answer and replay policies are frozen and all prior profile/response inputs remain unchanged',()=>{
 const q=read(root+'question-freeze.json'),p=read(root+'replay-policy-freeze.json'),a=read(root+'answer-freeze.json');
 assert.equal(sha(root+'question-map.json'),q.questionMapSHA256);assert.equal(sha(root+'question-freeze.json'),p.questionFreezeSHA256);
 for(const [f,h]of Object.entries({...q.matchingFiles,...p.files}))assert.equal(sha(f),h,f);
 for(const r of q.inputs)assert.equal(sha(r.file),r.sha256,r.file);
 for(const [k,h]of Object.entries(a.answerHashes))assert.equal(sha(root+'answers-'+k+'.json'),h);
 assert.equal(sha(root+'post-replay-quality-review.json'),read(root+'final-review-freeze.json').sha256);assert.equal(a.responses,1077);assert.equal(a.models,117);assert.equal(q.rounds,1);assert.equal(q.maxQuestions,12);
});
test('new inferred answers never overwrite existing answer IDs or impersonate student responses',()=>{
 for(const {c,state:base}of currentModelStates()){
  const before=JSON.stringify(base),r=replayBroadFollowups052(base,c.id);assert.equal(JSON.stringify(base),before);
  for(const key of ['coreWork','expandedInterests'])for(const[id,a]of Object.entries(base.profileJourney[key]||{}))assert.deepEqual(r.state.profileJourney[key][id],a,c.id+' '+id);
  for(const[f,qs]of Object.entries(base.profileJourney.depth||{}))for(const[id,a]of Object.entries(qs))assert.deepEqual(r.state.profileJourney.depth[f][id],a,c.id+' '+id);
  for(const a of r.trace.filter(a=>a.applied)){
   assert.ok(a.evidence?.trim());if(['yes','selected'].includes(a.response)){assert.equal(a.constructSupport,'direct');assert.notEqual(a.confidence,'low');}
   const inferred=a.kind==='expanded'?r.state.profileJourney.expandedInterests[a.questionId]:a.kind==='core'?r.state.profileJourney.coreWork[a.questionId]:null;
   if(inferred){assert.equal(inferred.source,'profile-inferred');assert.equal(inferred.confidence,a.confidence);}
  }
  assert.ok(r.trace.filter(a=>a.applied).length<=12);
 }
});
test('current Top matches use unchanged confirmation gates, while uncertain work remains pending',()=>{
 for(const {c,state}of currentModelStates()){
  const replay=replayBroadFollowups052(state,c.id),plan=planMatchCandidates(replay.state);
  for(const row of plan.top){assert.equal(row.confirmation.confirmed,true,c.id+' '+row.id);for(const q of row.confirmation.questions){assert.equal(q.answer?.response,'yes');assert.ok(!q.answer?.reviewHold);if(q.answer.source==='profile-inferred')assert.ok(['high','medium'].includes(q.answer.confidence));}}
 }
});
test('paired reporting keeps base, original holdout, fresh holdout and diagnostic denominators separate',()=>{
 const report=read('validation/broad-followups-052.json');assert.equal(report.total.before.models,172);assert.equal(report.total.after.models,172);assert.equal(report.cohorts.holdout.after.models,30);assert.equal(report.cohorts.holdout049.after.models,12);assert.equal(report.cohorts.diagnostic049.after.models,12);
 assert.equal(report.total.before.degreeTop,125);assert.equal(report.total.before.topCovers,60);assert.equal(report.rows.length,184);assert.equal(report.total.after.degreeTop,125);assert.equal(report.total.after.degreeTopOffers,232);assert.equal(report.total.after.topCovers,61);assert.equal(report.total.topChanged,5);assert.equal(report.rows.flatMap(r=>r.answers.filter(a=>a.reviewHold&&a.applied)).length,10);
 const selected=report.rows.filter(r=>r.phase==='holdout049').map(r=>({id:r.id,phase:r.phase,followup052:r})),html=followup052Table(selected,{holdout049:'Fresh holdout'},'degree');assert.match(html,/<td>12<\/td>/);assert.doesNotMatch(html,/undefined|NaN/);assert.match(followup052Trail(selected[0]),/New follow-up answers/);
 const held=report.rows.find(r=>r.id==='life-075');assert.match(followup052Trail({id:held.id,followup052:held}),/Original authored response:/);assert.match(followup052Trail({id:held.id,followup052:held}),/Question to resolve this:/);
 for(const r of report.rows)assert.equal(r.topChanged,JSON.stringify(r.before.map(p=>p.id))!==JSON.stringify(r.after.map(p=>p.id)));
});
