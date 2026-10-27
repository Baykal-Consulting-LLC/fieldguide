import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {broadExplorationPool,broadQuestionQueue,explorationPreview,answerBroadQuestion,explorationQuestionAnswer,beginBroadRound,broadRoundQuestion} from '../dist/broad-exploration.js';
import {broadExplorationPage} from '../dist/broad-exploration-ui.js';
import {broadEvaluationTable,broadEvaluationTrail} from '../dist/broad-exploration-review-ui.js';
import {studentModelScreen} from '../dist/student-model-view.js';
import {planMatchCandidates} from '../dist/plan-matches.js';
import {expandedOccupations} from '../dist/expanded-occupation-data.js';
import {scoreOnetInterest,profileCorrelation,interestFit} from '../dist/onet-assessment.js';
import {expandedQuestionBank} from '../dist/expanded-question-bank.js';
import {cleanProfileJourney} from '../dist/profile-journey.js';
const c=JSON.parse(fs.readFileSync('validation/blind-2026-10-18/life-013.json'));
test('cross-field discovery is independent of first field, budget, education preference, self-confidence and protected background',()=>{
 const s=structuredClone(c.experimentState),before=JSON.stringify(s),pool=broadExplorationPool(s),ids=p=>p.rows.map(r=>r.id);
 assert.ok(pool.rows.length>0);const altered=structuredClone(s);altered.profileJourney.family='health';altered.profileJourney.families=['health'];altered.profileJourney.answers.education=['training'];altered.profileJourney.skills={};altered.finance={};altered.guide.lifestylePreset='';altered.demographics={gender:'other'};altered.mentalHealth={anxiety:true};
 assert.deepEqual(ids(broadExplorationPool(altered)),ids(pool));assert.deepEqual(broadQuestionQueue(altered).map(q=>q.questionId),broadQuestionQueue(s).map(q=>q.questionId));assert.equal(JSON.stringify(s),before);
 assert.ok(explorationPreview(pool.rows).length<=6);assert.equal(new Set(broadQuestionQueue(s).map(q=>q.questionId)).size,broadQuestionQueue(s).length);
 const top=planMatchCandidates(s).top.map(r=>r.id);broadExplorationPage(s,'journey/discover');assert.deepEqual(planMatchCandidates(s).top.map(r=>r.id),top);
});
test('a new reflection persists through cleaning; uncertain work stays unresolved; malformed input is rejected without mutation',()=>{
 const s=structuredClone(c.experimentState),entry=broadQuestionQueue(s,{limit:1})[0];assert.ok(entry);
 const before=JSON.stringify(s);assert.equal(answerBroadQuestion(s,{careerId:entry.careerId,questionId:entry.questionId,response:'selected',selected:['invented']}),false);assert.equal(JSON.stringify(s),before);
 const top=planMatchCandidates(s).top.map(r=>r.id);assert.equal(answerBroadQuestion(s,{careerId:entry.careerId,questionId:entry.questionId,response:'unsure'}),true);
 const row=broadExplorationPool(s).rows.find(r=>r.id===entry.careerId),answer=explorationQuestionAnswer(s,row,entry.q);assert.ok(answer);assert.equal(row.confirmed,false);assert.deepEqual(planMatchCandidates(s).top.map(r=>r.id),top);
 const cleaned={...s,profileJourney:cleanProfileJourney(s.profileJourney)};assert.deepEqual(explorationQuestionAnswer(cleaned,row,entry.q),answer);assert.ok(!broadQuestionQueue(s).some(q=>q.questionId===entry.questionId));
});
test('no answers are copied between professions merely because they share a question domain',()=>{
 const fixture=JSON.parse(fs.readFileSync('validation/blind-2026-10-18/life-001.json')),s=structuredClone(fixture.experimentState),pool=broadExplorationPool(s),row=pool.rows.find(r=>r.expanded&&r.unasked.length);assert.ok(row,'expanded inventory must participate in discovery');const picture=scoreOnetInterest(s),expected=expandedOccupations.filter(o=>o.vector&&expandedQuestionBank[o.id]?.topEligible&&interestFit(profileCorrelation(picture.raw,o.vector)).tier>=2).map(o=>o.id).sort();assert.deepEqual(pool.rows.filter(r=>r.expanded).map(r=>r.id).sort(),expected);
 const q=row.unasked[0],other=pool.rows.find(r=>r.expanded&&r.id!==row.id&&r.unasked.some(x=>x.domain===q.domain));assert.ok(other);
 const otherBefore=structuredClone(s.profileJourney.expandedInterests||{});assert.equal(answerBroadQuestion(s,{careerId:row.id,questionId:q.id,response:'yes'}),true);
 for(const otherQ of other.questions)assert.deepEqual(s.profileJourney.expandedInterests[otherQ.id],otherBefore[otherQ.id]);
 assert.equal(broadExplorationPool(s).rows.find(r=>r.id===row.id).confirmed,false);
});
test('full replay retains paired outcomes and independent cohort denominators; report filters apply to each paired offer list',()=>{
 const report=JSON.parse(fs.readFileSync('validation/broad-exploration-051.json'));
 assert.equal(report.total.models,172);assert.equal(report.cohorts.holdout.models,30);assert.equal(report.cohorts.holdout049.models,12);assert.equal(report.cohorts.diagnostic049.models,12);
 assert.equal(report.total.newTop,0);assert.equal(report.total.pathInvariant,172);assert.equal(report.total.degreeTop,125);assert.equal(report.total.sustainingTop,60);
 for(const r of report.rows){assert.equal(r.sameAnswers,true);assert.deepEqual(r.before.map(p=>p.id),r.after.map(p=>p.id));assert.ok(r.questionPreview.every(q=>q.response==='unasked'&&!q.inferred));}
 const rows=report.rows.filter(r=>r.phase==='holdout049').map(r=>({id:r.id,phase:r.phase,broadReview:r})),html=broadEvaluationTable(rows,{holdout049:'Fresh holdout'},'degree');assert.match(html,/Fresh holdout/);assert.match(html,/8 → 8/);assert.doesNotMatch(html,/undefined|NaN/);
 assert.match(broadEvaluationTrail(rows[0],'degree'),/Try broader discovery/);assert.doesNotMatch(broadEvaluationTrail(rows[0],'degree'),/undefined|NaN/);
});

test('a saved short round preserves cross-career question order after sequential unsure answers and resume',()=>{
 const fixture=JSON.parse(fs.readFileSync('validation/blind-2026-10-18/life-001.json')),s=structuredClone(fixture.experimentState),expected=broadQuestionQueue(s).map(q=>({careerId:q.careerId,questionId:q.questionId}));
 beginBroadRound(s);assert.deepEqual(s.profileJourney.broadRound.questions,expected);const seen=[];
 for(let count=0;count<12;count++){
  const entry=broadRoundQuestion(s);if(!entry)break;seen.push({careerId:entry.careerId,questionId:entry.questionId});
  assert.equal(answerBroadQuestion(s,{careerId:entry.careerId,questionId:entry.questionId,response:'unsure'}),true);
  s.profileJourney.broadRound.cursor=entry.index+1;s.profileJourney=cleanProfileJourney(s.profileJourney);
 }
 assert.deepEqual(seen,expected);assert.equal(broadRoundQuestion(s),null);assert.ok(new Set(seen.slice(0,3).map(q=>q.careerId)).size>=3);
});

test('the chart student preview resolves discovery and reflection routes instead of silently falling back to professions',()=>{
 const s=structuredClone(c.experimentState);assert.match(studentModelScreen(s,'journey/discover'),/Keep your possibilities open/);
 const fixture=JSON.parse(fs.readFileSync('validation/blind-2026-10-18/life-001.json'));beginBroadRound(fixture.experimentState);
 assert.match(studentModelScreen(fixture.experimentState,'journey/discover/reflect/0'),/broad-reflection/);
});

test('the generated model-preview bundle retains the discovery UI and round controls',()=>{
 const bundle=fs.readFileSync('dist/assets/student-model-view.js','utf8');assert.match(bundle,/Keep your possibilities open/);assert.match(bundle,/broad-reflect/);assert.match(bundle,/broad-start/);
});
