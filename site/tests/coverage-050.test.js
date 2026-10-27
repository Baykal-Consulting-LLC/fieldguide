import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {expandedOccupations} from '../dist/expanded-occupation-data.js';
import {expandedPayData} from '../dist/expanded-pay-data.js';
import {expandedPayOpportunity} from '../dist/expanded-pay.js';
import {selectTopPlanMatches} from '../dist/match-selection.js';
import {earlierCollegeExploration,explorationExample} from '../dist/career-exploration-ui.js';
import {planMatchCandidates} from '../dist/plan-matches.js';
const c=JSON.parse(fs.readFileSync('validation/blind-2026-10-18/life-013.json'));
test('new wage evidence preserves occupation scope and never treats unresolved training or broader SOC wages as first paid coverage',()=>{
 assert.equal(Object.keys(expandedPayData).length,30);let assessed=0;
 for(const[id,e]of Object.entries(expandedPayData)){
  assert.ok(e.amount>0);assert.equal(e.firstPaidStageVerified,false);assert.equal(e.trainingCostVerified,false);assert.match(e.sourceURL,/^https:\/\/(texaswages.com|www.onetonline.org)/);
  const before=JSON.stringify(c.experimentState),op=expandedPayOpportunity(c.experimentState,expandedOccupations.find(o=>o.id===id));
  assert.equal(JSON.stringify(c.experimentState),before);assert.equal(op.qualifiedPay,e.amount);
  if(e.entryComparable){assessed++;assert.equal(op.firstPay,e.amount);assert.ok(op.start);assert.equal(typeof op.meetsAtStart,'boolean');}
  else {assert.equal(op.firstPay,null);assert.equal(op.meetsAtStart,null);assert.equal(op.start,null);}
 }assert.equal(assessed,18);
 const unknown=expandedOccupations.find(o=>!expandedPayData[o.id]);const op=expandedPayOpportunity(c.experimentState,unknown);assert.equal(op.firstPay,null);assert.equal(op.qualifiedPay,null);assert.equal(op.meetsAtStart,null);
});
test('comparable-fit affordability can add a college companion and preserve the strongest noncollege interest',()=>{
 const make=(id,o,r,pay,covers,confidence='high')=>({id,o,expandedDegree:!!o.expandedDegree,confirmation:{confirmed:true,questions:[{answer:{source:'profile-inferred',confidence}}]},interestMatch:{tier:2,r},opportunity:{firstPay:pay,requiresExperience:false},meetsLifestyle:covers});
 const non=make('non',{id:'hairdresser'},.92,30000,false),college=make('degree',{id:'degree-test',expandedDegree:true,educationGroup:'college',preparation:{typicalEducation:['Bachelor']}},.87,80000,true),other=make('other',{id:'degree-other',expandedDegree:true,educationGroup:'college',preparation:{typicalEducation:['Bachelor']}},.85,75000,true);
 assert.equal(selectTopPlanMatches([non,college],1)[0].id,'degree');assert.ok(selectTopPlanMatches([non,college,other],2).some(r=>r.id==='non'));
 const weak={...college,interestMatch:{tier:1,r:.3},opportunity:{firstPay:300000}};assert.equal(selectTopPlanMatches([non,weak],1)[0].id,'non');
 const low={...college,confirmation:{confirmed:true,questions:[{answer:{source:'profile-inferred',confidence:'medium'}}]}};assert.equal(selectTopPlanMatches([non,low],1)[0].id,'non');
});
test('exploration invites reflection without changing existing scores, answers or Top eligibility',()=>{
 const before=JSON.stringify(c.experimentState),ids=planMatchCandidates(c.experimentState).top.map(r=>r.id);earlierCollegeExploration(c.experimentState);assert.equal(JSON.stringify(c.experimentState),before);assert.deepEqual(planMatchCandidates(c.experimentState).top.map(r=>r.id),ids);
 assert.match(explorationExample('animation-interest-044-1'),/small example/i);assert.match(explorationExample('animation-interest-044-1'),/unsure|unfamiliar/);assert.equal(explorationExample('unknown-question'),'');
});
test('all original biographies and frozen response histories remain byte identical',()=>{
 const lock=JSON.parse(fs.readFileSync('research/coverage-050/input-lock.json'));assert.ok(lock.files.length>=300);for(const r of lock.files)assert.equal(createHash('sha256').update(fs.readFileSync(r.file)).digest('hex'),r.sha256,r.file);
});
test('holdout uses the frozen policy; operational amendments and raw reflection hashes are explicit',()=>{
 const read=f=>JSON.parse(fs.readFileSync('research/coverage-050/'+f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),freeze=read('rule-freeze.json'),amendments=read('operational-amendments.json'),answers=read('answer-freeze.json');
 assert.equal(freeze.beforeHoldoutAnswering,true);for(const[file,hash]of Object.entries(freeze.files)){const a=amendments.changes.find(a=>a.file===file);if(a){assert.equal(a.beforeSHA256,hash);assert.equal(sha(file),a.afterSHA256);}else assert.equal(sha(file),hash,file);}
 for(const phase of['development','holdout'])assert.equal(sha('research/coverage-050/'+phase+'-answers.json'),answers[phase+'SHA256']);
 assert.equal(sha('research/coverage-050/rule-freeze.json'),answers.rulesFreezeSHA256);assert.equal(answers.models,26);assert.equal(answers.responses,57);
 const math=expandedPayData['degree-15202100'];assert.match(math.method,/10th-percentile/);assert.equal(math.geography,'United States');assert.equal(math.geographyFallback,true);assert.match(math.sourceURL,/onetonline/);
});
