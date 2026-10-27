import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../dist/model.js';
import {onetQuestions} from '../dist/onet-assessment.js';
import {explorerResults,explorerEvidence,explorerCareerQuestions} from '../dist/open-explorer.js';
import {saveExplorerAnswer} from '../dist/explorer-053-state.js';

const state=()=>{const s=freshState();for(const q of onetQuestions)s.profileJourney.officialInterest.answers[q.id]=({R:2,I:5,A:3,S:4,E:1,C:2})[q.theme];return s;};
function answerCareer(s,id,response='yes'){
  const questions=explorerCareerQuestions(id);assert.ok(questions.length,id+' must have an actual question bank');
  for(const q of questions){
    const payload=q.kind==='specific'||q.kind==='core-work'?{response}:{selected:q.options.filter(o=>o.careerIds.includes(id)).map(o=>o.id)};
    saveExplorerAnswer(s,{kind:'profession',scope:id,questionId:q.id,payload});
  }
}
test('frozen counterexample: analytical engineering survives rejection of manual repair without confirming every specialty',()=>{
  const s=state();answerCareer(s,'automotive','no');answerCareer(s,'mechanical-engineering');
  assert.ok(explorerEvidence(s,'mechanical-engineering').supported);
  assert.equal(explorerEvidence(s,'automotive').supported,false);
  assert.equal(explorerEvidence(s,'electrical-engineering').supported,false);
  assert.ok(explorerResults(s,{scope:'building'}).rows.some(r=>r.id==='mechanical-engineering'));
});
test('frozen counterexample: practical circuit interest leaves mathematical design open instead of imputing a degree fit',()=>{
  const s=state(),questions=explorerCareerQuestions('electrical-engineering');
  for(const q of questions)if(q.kind!=='specific')saveExplorerAnswer(s,{kind:'profession',scope:'electrical-engineering',questionId:q.id,payload:{selected:q.options.filter(o=>o.careerIds.includes('electrical-engineering')).map(o=>o.id)}});
  for(const q of questions.filter(q=>q.kind==='specific'))saveExplorerAnswer(s,{kind:'profession',scope:'electrical-engineering',questionId:q.id,payload:{response:'unfamiliar'}});
  assert.equal(explorerEvidence(s,'electrical-engineering').supported,false);
  assert.ok(explorerResults(s,{education:'degree'}).rows.some(r=>r.id==='electrical-engineering'));
});
test('frozen counterexample: health-specific survey cannot substitute unrelated globally supported software',()=>{
  const s=state();answerCareer(s,'physician');answerCareer(s,'software');
  const rows=explorerResults(s,{scope:'health'}).rows;
  assert.ok(explorerEvidence(s,'physician').supported);
  assert.ok(explorerEvidence(s,'software').supported);
  assert.ok(rows.some(r=>r.id==='physician'&&r.specific.supported));
  assert.ok(rows.every(r=>r.fields.includes('health')));
  assert.ok(!rows.some(r=>r.id==='software'));
  // Procedure interests were never answered for a surgical specialty.
  assert.ok(!rows.filter(r=>/surgeon/i.test(r.o.title)).some(r=>r.specific.supported));
});
test('frozen counterexample: declining clinical care cannot veto specifically supported epidemiology',()=>{
  const s=state(),epidemiology=explorerResults(s).rows.find(r=>/Epidemiologists/.test(r.o.title));
  assert.ok(epidemiology);answerCareer(s,'physician','no');answerCareer(s,epidemiology.id);
  assert.equal(explorerEvidence(s,'physician').supported,false);
  assert.ok(explorerEvidence(s,epidemiology.id).supported);
  assert.ok(explorerResults(s,{scope:'health'}).rows.some(r=>r.id===epidemiology.id));
});
test('frozen counterexample: personal illness exposure creates no health interest evidence',()=>{
  const s=state(),before=explorerResults(s,{scope:'health'}).rows.map(r=>[r.id,r.r,r.specific.supported]);
  s.challenges={health:'Synthetic illness-management experience',stress:4};s.profile.supportNeeds='Medication and appointment planning';
  assert.deepEqual(explorerResults(s,{scope:'health'}).rows.map(r=>[r.id,r.r,r.specific.supported]),before);
  assert.ok(explorerResults(s,{scope:'health'}).rows.every(r=>!r.specific.supported));
});
test('frozen counterexample: reviewed health/engineering overlap remains in scope while unrelated branches stay out',()=>{
  const s=state();answerCareer(s,'biomedical-engineering');answerCareer(s,'mechanical-engineering');
  const health=explorerResults(s,{scope:'health'}).rows,building=explorerResults(s,{scope:'building'}).rows;
  assert.ok(health.some(r=>r.id==='biomedical-engineering'&&r.specific.supported));
  assert.ok(building.some(r=>r.id==='biomedical-engineering'));
  assert.ok(!health.some(r=>r.id==='mechanical-engineering'));
});
