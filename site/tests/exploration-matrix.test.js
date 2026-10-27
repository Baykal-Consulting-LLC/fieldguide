import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,sanitizeState} from '../dist/model.js';
import {analyze} from '../dist/analysis.js';
import {careerCandidates,privateExplorationForReport,selectedFollowUps} from '../dist/exploration.js';
import {careerReflectionPage} from '../dist/exploration-ui.js';
import {getCareerFacts,occupations} from '../dist/occupation-data.js';
import {reportExport} from '../dist/results-ui.js';
import {careerBriefReport} from '../dist/career-report.js';

const answers=['answered','not-tried','unsure','skipped'];
const exposures=['','new','some','often'];
const confidence=[null,1,2,3,4,5];
const combinations=answers.flatMap(status=>exposures.flatMap(exposure=>confidence.map(level=>({status,exposure,confidence:level}))));

function setRawInterest(state,top='R'){
  const scores={R:'1',I:'1',A:'1',S:'1',E:'1',C:'1'};
  scores[top]='9';
  Object.assign(state.results.interest,{form:'onet-60-paper',version:'paper',source:'Synthetic matrix fixture',origin:'paper',date:'2026-10-16',representation:'raw',min:'0',max:'10',verified:true,suitable:true,scores});
  return state;
}

function assertCandidateContract(row){
  assert.equal(typeof row.id,'string');
  assert.equal(row.career.id,row.id);
  assert.ok(['student-choice','official-return','editorial','related','discovery'].includes(row.category));
  assert.ok(Array.isArray(row.evidence));
  for(const evidence of row.evidence){assert.equal(typeof evidence.id,'string');assert.equal(typeof evidence.type,'string');assert.equal(typeof evidence.label,'string');assert.equal(typeof evidence.reference,'string');}
  assert.ok(Array.isArray(row.unknowns));
  assert.ok(row.unknowns.every(value=>typeof value==='string'));
  assert.equal(typeof row.experiment.title,'string');
  assert.equal(typeof row.experiment.detail,'string');
  assert.equal(typeof row.experiment.notice,'string');
  assert.equal(typeof row.selected,'boolean');
  assert.equal('score' in row,false);
  assert.equal('fit' in row,false);
}

test('all 117 reviewed occupations expose unique valid follow-ups with the three required base prompts',()=>{
  assert.equal(occupations.length,117);
  for(const career of occupations){
    const prompts=selectedFollowUps(freshState(),career.id);
    const ids=prompts.map(prompt=>prompt.id);
    assert.ok(prompts.length>=3&&prompts.length<=6,`${career.id} has ${prompts.length} prompts`);
    assert.equal(new Set(ids).size,ids.length,`${career.id} has duplicate prompt IDs`);
    for(const required of ['task-preference','setting-schedule','learning-route'])assert.ok(ids.includes(required),`${career.id} lacks ${required}`);
    for(const prompt of prompts){assert.equal(prompt.careerId,career.id);assert.equal(typeof prompt.text,'string');assert.ok(prompt.text.length>0);}
  }
});

test('status, exposure, and confidence combinations round-trip across every reviewed occupation',()=>{
  const state=freshState();let index=0;const covered=new Set();
  for(const career of occupations){
    const answersForCareer={};
    for(const prompt of selectedFollowUps(state,career.id)){
      const combo=combinations[index%combinations.length];
      covered.add(`${combo.status}|${combo.exposure}|${combo.confidence??''}`);
      answersForCareer[prompt.id]={...combo,response:`Matrix response ${career.id}/${prompt.id}`,evidence:`Evidence ${career.id}/${prompt.id}`,date:'2026-10-16'};
      index++;
    }
    state.exploration.followUps[career.id]=answersForCareer;
  }
  assert.ok(index>=combinations.length,`only ${index} prompt cases were enumerated`);
  assert.equal(covered.size,combinations.length,'the matrix must exercise every status × exposure × confidence combination');
  const restored=sanitizeState(state);
  for(const career of occupations){
    const expected=state.exploration.followUps[career.id],actual=restored.exploration.followUps[career.id];
    assert.deepEqual(actual,expected,`${career.id} follow-ups changed during v1 draft cleaning`);
  }
});

test('candidate lanes preserve evidence shape and expose missing context without ranking scores',()=>{
  const lanes=new Set();
  const collect=state=>{for(const row of careerCandidates(state)){assertCandidateContract(row);lanes.add(row.category);}};

  const discovery=freshState();collect(discovery);
  const student=freshState();student.exploration.context.nomination='Industrial Designer';collect(student);
  const provider=freshState();provider.results.providerReturns={ids:['market-research'],source:'Synthetic provider return',date:'2026-10-15',verified:true};collect(provider);
  const editorial=setRawInterest(freshState(),'R');assert.ok(analyze(editorial).items.some(item=>item.interestLinked));collect(editorial);
  const related=freshState();related.exploration.savedCareers=['industrial-design'];related.exploration.careerChoices['industrial-design']='explore';collect(related);
  const unknownContext=freshState();unknownContext.exploration.savedCareers=['tattoo'];unknownContext.exploration.careerChoices.tattoo='explore';
  const tattoo=careerCandidates(unknownContext).find(row=>row.id==='tattoo');
  assert.ok(tattoo.unknowns.includes('Work setting and schedule details have not been reviewed.'));
  assert.ok(tattoo.unknowns.includes('Preparation details need source review.'));

  for(const lane of ['student-choice','official-return','editorial','related','discovery'])assert.ok(lanes.has(lane),`missing candidate lane ${lane}`);
  const seed=getCareerFacts('industrial-design');
  assert.ok(seed.relatedIds.length>0);
});

test('career-first ordering promotes already eligible candidates across lanes and respects set-aside choices',()=>{
  const state=freshState();
  state.exploration.careerOrder=['environmental-science','industrial-design'];
  const ordered=careerCandidates(state);
  assert.equal(ordered.length,5);
  assert.deepEqual(ordered.slice(0,2).map(row=>row.id),['environmental-science','industrial-design']);
  assert.ok(ordered.every(row=>row.category==='discovery'));

  state.exploration.careerChoices['environmental-science']='later';
  const setAside=careerCandidates(state);
  assert.ok(!setAside.some(row=>row.id==='environmental-science'));
  assert.equal(setAside[0].id,'industrial-design');
});

test('provider-display interest values never create interest-driven occupation labels',()=>{
  const state=freshState();
  Object.assign(state.results.interest,{form:'onet-60-paper',version:'paper',source:'Synthetic display fixture',origin:'report',date:'2026-10-16',representation:'provider-display',min:'0',max:'10',verified:true,suitable:true,scores:{R:'9',I:'1',A:'1',S:'1',E:'1',C:'1'}});
  assert.equal(analyze(state).status.kind,'display-only');
  const rows=careerCandidates(state);
  assert.ok(rows.every(row=>row.category!=='editorial'));
  assert.ok(rows.every(row=>row.evidence.every(evidence=>evidence.type!=='interest')));
});

test('no-score experience and student direction choices can introduce their mapped careers',()=>{
  const experience=freshState();experience.results.connections.design={experience:'enjoyed',notes:'I enjoyed making a museum exhibit model.',preparation:'',choice:''};
  const designDirection=analyze(experience).items.find(item=>item.id==='design');
  assert.equal(designDirection.interestLinked,false);
  const mapped=occupations.find(career=>career.soc===designDirection.soc);
  assert.ok(mapped,'design direction maps to a reviewed occupation');
  const experienceCandidate=careerCandidates(experience).find(row=>row.id===mapped.id);
  assert.ok(experienceCandidate);
  assert.equal(experienceCandidate.category,'editorial');
  assert.ok(experienceCandidate.evidence.some(item=>item.type==='experience'&&item.reference==='I enjoyed making a museum exhibit model.'));

  const choice=freshState();choice.results.connections.design={experience:'',notes:'',preparation:'',choice:'explore'};
  const choiceCandidate=careerCandidates(choice).find(row=>row.id===mapped.id);
  assert.ok(choiceCandidate);
  assert.ok(choiceCandidate.evidence.some(item=>item.type==='choice'));

  const questions=freshState();questions.exploration.careerOrder=['psychiatric-aide'];questions.exploration.careerChoices['psychiatric-aide']='questions';
  const questionCandidate=careerCandidates(questions)[0];
  assert.equal(questionCandidate.id,'psychiatric-aide');
  assert.equal(questionCandidate.category,'student-choice');
  assert.equal(questionCandidate.selected,true);
  assert.equal(questionCandidate.evidence[0].label,'You have questions about this occupation.');
});

test('experience evidence enters reports only after the personal-note privacy opt-in',()=>{
  const state=freshState();state.results.connections.design={experience:'enjoyed',notes:'Synthetic private experience note',preparation:'',choice:''};
  assert.ok(careerCandidates(state).some(row=>row.evidence.some(item=>item.reference==='Synthetic private experience note')));
  assert.ok(!JSON.stringify(reportExport(state)).includes('Synthetic private experience note'));
  assert.ok(!careerBriefReport(state).includes('Synthetic private experience note'));
  state.results.includeNotes=true;
  assert.ok(JSON.stringify(reportExport(state)).includes('Synthetic private experience note'));
  assert.ok(careerBriefReport(state).includes('Synthetic private experience note'));
});

test('private narrative is HTML-escaped and omitted from report exports unless opted in',()=>{
  const state=freshState(),careerId='psychiatric-aide';
  state.exploration.careerQuestions[careerId]='<img src=x onerror=alert(1)> keep this private';
  state.exploration.careerNotes[careerId]='<svg onload=alert(1)> synthetic private note';
  state.exploration.context.supportNeeds='private support context';
  state.exploration.followUps[careerId]={'task-preference':{response:'<script>alert(1)</script>',status:'answered',evidence:'<b>private evidence</b>',date:'2026-10-16'}};

  const html=careerReflectionPage(careerId,state);
  for(const raw of ['<img src=x','<svg onload=','<script>alert','<b>private'])assert.ok(!html.includes(raw),`unsafe markup rendered: ${raw}`);
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.equal(privateExplorationForReport(state),null);
  assert.equal(privateExplorationForReport(state,false),null);
  assert.equal(privateExplorationForReport(state,true).careerNotes[careerId],state.exploration.careerNotes[careerId]);

  const privateMarker='synthetic private note';
  const defaultExport=JSON.stringify(reportExport(state));
  assert.ok(!defaultExport.includes(privateMarker));
  assert.ok(!defaultExport.includes('private support context'));
  state.results.includeNotes=true;
  const optedExport=JSON.stringify(reportExport(state));
  assert.ok(optedExport.includes(privateMarker));
  assert.ok(optedExport.includes('private support context'));
});
