import {twcEntryWages} from '../dist/twc-entry-wages.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {careers} from '../dist/finance-data.js';
import {salaryProgression,salaryAtStage,salaryCareerIds,salaryStageOptions,salaryPreviewStages,formatSalary,roundSalary} from '../dist/salary-progression.js';
import {salaryPanel,salaryEvidenceLabel} from '../dist/salary-ui.js';

test('salary presentation uses requested thresholds and never rounds calculation inputs',()=>{
 for(const [input,expected] of [[47450,47000],[49999,50000],[50000,50000],[52499,50000],[52500,55000],[73200,75000],[99999,100000],[100000,100000],[104999,100000],[105000,110000],[134120,130000]])assert.equal(roundSalary(input),expected);
 assert.equal(formatSalary(47450),'$47K');assert.equal(formatSalary(73200),'$75K');assert.equal(formatSalary(134120),'$130K');
 for(const invalid of [null,undefined,'50000',NaN,Infinity,-1]){assert.equal(roundSalary(invalid),null);assert.equal(formatSalary(invalid),'—');}
 const p=salaryProgression('software');assert.equal(p.stages[0].amount,twcEntryWages.software.amount);assert.notEqual(p.stages[0].amount,roundSalary(p.stages[0].amount));
});

test('all 117 reviewed occupations have complete bounded planning scenarios and honest source scope',()=>{
 assert.equal(salaryCareerIds.length,117);assert.equal(new Set(salaryCareerIds).size,117);
 for(const id of salaryCareerIds){
  const p=salaryProgression(id);assert.equal(p.careerId,id);assert.equal(p.stages.length,4);assert.ok(p.sources.every(s=>s.url?.startsWith('https://')));assert.match(p.geography,/Austin|Dallas/);
  assert.deepEqual(p.stages.map(s=>s.key),['entry','year5','year10','year20']);assert.deepEqual(p.stages.map(s=>s.years),[0,5,10,20]);
  assert.ok(p.notes.some(n=>/No future inflation/.test(n)));assert.ok(p.notes.some(n=>/qualified job/.test(n)));
  for(let i=0;i<4;i++){assert.ok(Number.isFinite(p.stages[i].amount)&&p.stages[i].amount>0,id);if(i)assert.ok(p.stages[i].amount>=p.stages[i-1].amount,id);assert.equal(salaryAtStage(id,p.stages[i].key),p.stages[i].amount);}
  if(!['teaching','elementary-teacher','high-school-teacher','police'].includes(id)){assert.equal(p.method,'modeled_local_wage_scenario');assert.ok(p.stages.slice(id==='firefighter'?1:0).every(s=>s.estimate));assert.equal(p.assumptions.measuredExperienceData,false);assert.equal(p.stages[3].amount,p.assumptions.matureAmount);}
 }
 assert.equal(salaryProgression('unknown-career'),null);assert.equal(salaryAtStage('unknown-career'),null);assert.equal(salaryAtStage('software','year999'),null);
 assert.deepEqual(salaryStageOptions.map(s=>s.label),['Entry level','5 years','10 years','20 years']);
});

test('teaching uses the actual current AISD schedule as one employer example',()=>{
 const p=salaryProgression('teaching');assert.deepEqual(p.stages.map(s=>s.amount),[58069,59772,63944,68844]);assert.ok(p.stages.every(s=>!s.estimate));assert.equal(p.method,'published_employer_schedule');assert.match(p.label,/ISD example/);assert.equal(p.assumptions.contractDays,187);assert.match(p.notes[0],/not a promise/);
 assert.equal(p.stages[0].sourceLabel,'0–2 credited years · certified');assert.ok(p.stages.every(s=>s.checkedAt==='2026-10-18'&&s.referencePeriod==='2026–2027 academic year'));assert.ok(p.notes.some(n=>/new-hire.*incumbent/.test(n)));
});

test('Fire refresh preserves occupation evidence and applies its current employer entry floor without invented raises',()=>{
 const p=salaryProgression('firefighter');
 assert.deepEqual(p.stages.map(s=>s.amount),[67999,67999,67999,67999]);
 assert.equal(p.experiencedAnchor.amount,67726);assert.equal(p.experiencedAnchor.dollarYear,2025);assert.match(p.experiencedAnchor.sourceURL,/texaswages/);
 assert.equal(p.stages[0].evidence,'employer_schedule');assert.equal(p.stages[0].checkedAt,'2026-10-18');assert.match(p.stages[0].referencePeriod,/effective date not stated/);
 assert.ok(p.stages.slice(1).every(s=>s.estimate&&s.evidence==='illustration'&&/2025.*2026/.test(s.referencePeriod)));
 assert.equal(p.assumptions.matureAmount,67999);assert.equal(p.paidTraining.amount,46904);assert.equal(p.entryProxy,null);
 assert.match(salaryPanel('firefighter'),/Starting pay is Austin Fire/);
});

test('police carried source steps are visible and never marked as exact five- or twenty-year observations',()=>{
 const p=salaryProgression('police');
 assert.deepEqual(p.stages.map(s=>s.years),[0,5,10,20]);assert.deepEqual(p.stages.map(s=>s.sourceYears),[0,2,10,16]);
 assert.deepEqual(p.stages.map(s=>s.estimate),[false,true,false,true]);
 for(const i of [1,3]){assert.equal(p.stages[i].evidence,'employer_step_carried');assert.match(p.stages[i].basis,/carried into this planning comparison/);}
 const html=salaryPanel('police',{interactive:true,from:'guided-career'});
 assert.match(html,/2-year step carried forward/);assert.match(html,/16-year step carried forward/);
 assert.match(html,/#\/salary\/police\/year5\?from=guided-career/);assert.match(html,/data-id="year20"/);
 assert.doesNotMatch(html,/Current employer pay schedule/);
});

test('salary details retain source dates while initial generic cards identify planning estimates',()=>{
 const p=salaryProgression('software'),html=salaryPanel('software');
 assert.ok(p.stages.slice(1).every(s=>s.estimate&&s.dollarYear===2025&&s.geography===p.geography));
 assert.equal(salaryEvidenceLabel(p.stages[1]),'Planning estimate');
 assert.match(html.split('<summary>More info')[0],/Planning estimate/);assert.match(html,/not measured salaries at exact years or guaranteed raises/);
 assert.match(html,/texaswages.com\/Home\/About/);
 for(const id of ['physician','electrician','police','firefighter']){const training=salaryPreviewStages(id)[0];assert.equal(training.checkedAt,'2026-10-18');assert.ok(training.sourceURL.startsWith('https://'));assert.ok(training.referencePeriod);}
});

test('modeled pay stays in the same occupation and does not relabel observed quartiles as years',()=>{
 for(const c of careers.filter(c=>!['teaching','elementary-teacher','high-school-teacher','police','firefighter'].includes(c.id))){
  const p=salaryProgression(c),w=c.earnings,anchor=w.median??w.average;
  assert.equal(p.assumptions.anchorAmount,anchor);
  const upper=Math.max(anchor,w.p75||anchor*1.20);
  assert.ok(p.stages[3].amount<=Math.max(p.stages[0].amount,upper));assert.equal(p.assumptions.measuredExperienceData,false);assert.deepEqual(p.assumptions.progressionFractions,[0,.45,.75,1]);assert.ok(p.stages.slice(1).every(s=>s.evidence==='illustration'));
  assert.ok(p.sources.some(s=>/assumptions/.test(s.role)));
 }
 const s=salaryProgression('software');assert.notEqual(s.stages[0].amount,104000);assert.notEqual(s.stages[1].amount,134120);assert.notEqual(s.stages[2].amount,168730);
 const nurse=salaryProgression('nursing');assert.ok(nurse.notes.some(n=>/advanced-practice/.test(n)));
 const tattoo=salaryProgression('tattoo');assert.equal(tattoo.confidence,'low');assert.ok(tattoo.notes.some(n=>/studio rent/.test(n)));
});

test('additional mental health occupations retain exact occupation and fallback geography',()=>{
 const aide=salaryProgression('psychiatric-aide');assert.match(aide.geography,/Dallas/);assert.equal(aide.assumptions.anchorAmount,47780);assert.ok(aide.notes.some(n=>/fallback/.test(n)));
 assert.equal(salaryProgression('psychiatric-technician').assumptions.anchorAmount,40610);assert.equal(salaryProgression('clinical-psychologist').assumptions.anchorAmount,87930);
});

test('reading and editing a returned scenario does not mutate stored inputs or later results',()=>{
 const c=careers.find(c=>c.id==='software'),before=JSON.stringify(c),p=salaryProgression(c);p.stages[0].amount=1;p.assumptions.progressionFractions[0]=9;p.notes.push('changed');
 assert.equal(JSON.stringify(c),before);assert.equal(salaryProgression(c).stages[0].amount,twcEntryWages.software.amount);assert.ok(!salaryProgression(c).notes.includes('changed'));
});
