import {applyBroadFollowups052} from '../dist/broad-followups-052-replay.js';
import {applyCoverageExploration} from '../dist/coverage-050-replay.js';
import{readMatchChart}from'../scripts/read-match-chart.mjs';
import {expandedInterestState} from '../dist/expanded-interest.js';
import {professionConfirmationState} from '../dist/profession-confirmation.js';
import {modelComparisonAudit} from '../dist/model-comparison-audit.js';
import {professionReplayState} from '../dist/profession-replay.js';
import {careerComparisonOptions} from '../dist/career-comparisons.js';
import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';
import{modelMatchAudit,auditOutcome,filterAuditRows,auditCounts}from'../dist/model-match-audit.js';import{planMatchCandidates}from'../dist/plan-matches.js';import{educationRouteGroups}from'../dist/education-routes.js';import{studentModelState}from'../dist/student-model-view.js';
const replays=new Map(JSON.parse(fs.readFileSync('research/profession-replay-041/answers.json')).rows.map(r=>[r.id,r]));
const cores=new Map(JSON.parse(fs.readFileSync('research/profession-confirmation-042/answers.json')).rows.map(r=>[r.id,r]));
const interests=new Map(JSON.parse(fs.readFileSync('research/profession-interest-044/answers.json')).rows.map(r=>[r.id,r]));
const expanded=new Map(JSON.parse(fs.readFileSync('research/expanded-top-047/answers.json')).rows.map(r=>[r.id,r]));
const snapshot=readMatchChart(),rows=snapshot.rows.filter(r=>!r.cohort049);
test('the chart replays all148 frozen models without mutation and exactly matches student top, other and education lists',()=>{
 assert.equal(rows.length,148);assert.equal(new Set(rows.map(r=>r.id)).size,148);for(const row of rows){const c=JSON.parse(fs.readFileSync('validation/blind-2026-10-18/'+row.id+'.json')),before=JSON.stringify(c),r=modelComparisonAudit(c,replays.get(c.id),cores.get(c.id),interests.get(c.id),expanded.get(c.id)),finalState=applyBroadFollowups052(applyCoverageExploration(expandedInterestState(professionConfirmationState(professionConfirmationState(professionReplayState(c,replays.get(c.id)),cores.get(c.id)),interests.get(c.id)),expanded.get(c.id)),c.id),c.id),d=planMatchCandidates(finalState);assert.equal(JSON.stringify(c),before);assert.deepEqual(r,row);assert.deepEqual(r.top.map(x=>x.id),d.top.map(x=>x.id));assert.deepEqual(r.other.map(x=>x.id),d.other.slice(0,6).map(x=>x.id));const expected=[...new Set(educationRouteGroups.flatMap(g=>d.all.filter(x=>x.opportunity?.meetsAtStart&&!x.opportunity.requiresExperience&&x.opportunity.routes.some(a=>a.key===g.id)).slice(0,5).map(x=>x.id)))];assert.deepEqual(r.sustaining.map(x=>x.id),expected);assert.equal(r.recordedCareerChoice,null);assert.deepEqual(r.scores,c.results.rawScores);
 const preview=studentModelState({...c,experimentState:finalState},c.experimentState.guide.primaryCareer||''),student=planMatchCandidates(preview);assert.deepEqual(r.top.map(x=>x.id),student.top.map(x=>x.id),row.id+' student top');assert.deepEqual(r.explorations.map(x=>x.id),careerComparisonOptions(preview).rows.slice(0,3).map(x=>x.id),row.id+' pending student comparisons');assert.deepEqual(r.other.filter(x=>x.kind!=='chosen').map(x=>x.id),student.other.slice(0,6).filter(x=>x.kind!=='chosen').map(x=>x.id),row.id+' student other');}
});
test('counts partition models once, and all filter combinations share the original row grain',()=>{
 const n=auditCounts(rows);assert.equal(n.topCovers+n.otherCovers+n.noneCover+n.notAssessed,148);assert.deepEqual(auditCounts(snapshot.rows.filter(r=>r.phase!=='diagnostic049')),snapshot.counts);for(const cohort of['development','holdout','supplement','legacy']){const group=filterAuditRows(rows,{cohort});assert.ok(group.every(r=>r.phase===cohort));for(const outcome of['top-covers','other-covers','none-cover'])assert.ok(filterAuditRows(rows,{cohort,outcome}).every(r=>r.phase===cohort&&auditOutcome(r)===outcome));}assert.equal(filterAuditRows(rows,{query:'life-013'}).length,1);assert.equal(filterAuditRows(rows,{query:'no such model'}).length,0);assert.equal(filterAuditRows(rows).length,148);assert.ok(filterAuditRows(rows,{field:'creative'}).every(r=>r.field==='creative'));
});
test('lifestyle options are assessed at the first paid stage and exclude experience roles; missing budgets remain unknown',()=>{
 for(const r of rows)for(const option of r.sustaining){assert.equal(option.sustains,true);assert.equal(option.requiresExperience,false);assert.ok(option.monthlyRemaining>=0);assert.ok(option.firstPay>0);}const c=JSON.parse(fs.readFileSync('validation/blind-2026-10-18/life-013.json'));c.experimentState.guide.lifestylePreset='';const r=modelMatchAudit(c);assert.equal(auditOutcome(r),'not-assessed');assert.equal(r.goal,null);assert.equal(r.sustaining.length,0);
});
test('the public snapshot contains no private cases or raw biographies and the chart clears private details on auth change',()=>{
 assert.ok(rows.every(r=>r.phase!=='private'&&!r.id.startsWith('private-')&&!('biography'in r)&&!('experimentState'in r)));const controller=fs.readFileSync('dist/model-match-chart-controller.js','utf8');assert.match(controller,/getPrivateReviewCases/);assert.match(controller,/detail-content'\)\.replaceChildren/);assert.doesNotMatch(controller,/localStorage|setDoc|saveGuide/);const lab=fs.readFileSync('dist/model-lab-controller.js','utf8');assert.match(lab,/details id="history"/);assert.match(lab,/focused\.scrollIntoView/);
});
