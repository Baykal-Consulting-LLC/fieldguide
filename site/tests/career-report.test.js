import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../dist/model.js';
import {fictionalState} from '../dist/analysis.js';
import {careerCandidates} from '../dist/exploration.js';
import {careerBriefReport,careerBriefExport} from '../dist/career-report.js';
import {reportExport,visualReport} from '../dist/results-ui.js';

test('occupation shortlist separates student choices from editorial connections and discovery',()=>{
  const state=freshState();state.exploration.context.nomination='Psychiatric Aides';
  const candidates=careerCandidates(state);
  assert.equal(candidates[0].category,'student-choice');assert.equal(candidates[0].id,'psychiatric-aide');
  assert.ok(candidates.some(x=>x.category==='discovery'));
  const html=careerBriefReport(state);
  assert.match(html,/Student-selected career/);assert.match(html,/You nominated this occupation to include/);assert.match(html,/student selected|Not selected yet/);assert.match(html,/One small experiment/);
});

test('interest evidence requires a ready raw profile while independent choices and experiences remain',()=>{
  const state=fictionalState(freshState());
  let candidates=careerCandidates(state);
  assert.ok(candidates.some(x=>x.category==='editorial'));
  const html=careerBriefReport(state);
  assert.match(html,/Evidence ID:/);assert.match(html,/Relevant work/);assert.match(html,/mynextmove.org/);
  state.results.interest.representation='provider-display';
  candidates=careerCandidates(state);
  assert.ok(candidates.every(x=>!x.evidence.some(e=>e.type==='interest')));
  assert.ok(candidates.some(x=>x.category==='editorial'&&x.evidence.some(e=>e.type==='experience'||e.type==='choice')));
  assert.ok(candidates.some(x=>x.category==='discovery'));
});

test('career questions are labeled as questions rather than a decision to explore',()=>{
  const state=freshState();state.exploration.careerChoices['psychiatric-aide']='questions';
  const html=careerBriefReport(state);
  assert.match(html,/Student-selected career · questions/);
  assert.match(html,/You have questions about this occupation\./);
  assert.doesNotMatch(html,/You chose to explore/);
});

test('candidate and follow-up narratives are private unless report notes are opted in',()=>{
  const state=freshState();state.exploration.context.nomination='Psychiatric Aides';
  state.exploration.followUps['psychiatric-aide']={'task-preference':{response:'PRIVATE RESPONSE',status:'answered',date:'2026-10-16'}};
  state.exploration.careerNotes['psychiatric-aide']='PRIVATE CAREER NOTE';state.exploration.careerQuestions['psychiatric-aide']='PRIVATE QUESTION';
  assert.doesNotMatch(JSON.stringify(careerBriefExport(state)),/PRIVATE/);
  assert.doesNotMatch(JSON.stringify(reportExport(state)),/PRIVATE/);
  const html=visualReport(state);assert.doesNotMatch(html,/PRIVATE RESPONSE|PRIVATE CAREER NOTE|PRIVATE QUESTION/);
  state.results.includeNotes=true;
  assert.match(JSON.stringify(reportExport(state)),/PRIVATE RESPONSE/);
  assert.match(JSON.stringify(reportExport(state)),/PRIVATE CAREER NOTE/);
  assert.match(careerBriefReport(state),/PRIVATE RESPONSE/);
});

test('career evidence refreshes after a source correction and unknown states remain visible',()=>{
  const state=fictionalState(freshState());
  const before=careerBriefReport(state);assert.match(before,/Preparation to investigate/);
  state.results.interest.verified=false;
  const after=careerBriefReport(state);
  assert.doesNotMatch(after,/Interest evidence/);
  assert.match(after,/Related occupation|A new possibility to investigate/);
});

test('next useful step follows selected or provider-returned career exploration before generic directions',()=>{
 const state=freshState();
 state.exploration.savedCareers=['psychiatric-aide'];
 state.results.interest={...state.results.interest,form:'onet-30-online',representation:'provider-display',source:'Provider result page',date:'2026-10-16',min:'0',max:'10',scores:{R:'4',I:'4',A:'4',S:'10',E:'4',C:'4'}};
 state.results.providerReturns={ids:['psychiatric-technician'],source:'Provider result page',date:'2026-10-16',verified:true};
 const html=visualReport(state);
 assert.match(html,/Next useful step<\/h2><p>Psychiatric Aides: Explore one task safely<\/p>/);
 assert.doesNotMatch(html,/Next useful step<\/h2><p>Redesign one everyday object/);
 assert.doesNotMatch(html,/Preparation to investigate<\/h3><p>Job Zone [^<]*<\/p><p>sourced<\/p>/);
});
