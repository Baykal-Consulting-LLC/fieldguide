import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {payScenario,summarizeEarnings,wageRange} from '../dist/earnings.js';
import {earningSummary,earningsPage} from '../dist/earnings-ui.js';
import {freshLifestyleDraft,lifestyleChoices,setLifestyleChoice,confirmLifestyle,lifestyleSnapshot,updateBudget} from '../dist/lifestyle-state.js';
import {employeeTaxes,calculateLifestyle} from '../dist/shared-lifestyle/lifestyle.js';
import {scorePathways} from '../dist/engine.js';
const read=p=>JSON.parse(fs.readFileSync(p));
const meta=read('dist/data/pathway-earnings.json'),paths=read('dist/data/pathways.json').pathways;
const goal=()=>{const d=freshLifestyleDraft();for(const q of lifestyleChoices)setLifestyleChoice(d,q.id,1);confirmLifestyle(d);return d;};
test('all pathway projections retain exact program links, source fingerprints and one count per wage SOC',()=>{
 assert.equal(Object.keys(meta.pathways).length,paths.length);const prep=read('shared-data/education/bls-preparation-2025.json').records,education=new Map(prep.map(r=>[r.soc,r]));
 for(const p of paths){const rows=meta.pathways[p.id];assert.ok(rows.length>0);assert.equal(new Set(rows.map(r=>r.soc)).size,rows.length);for(const r of rows){assert.ok(p.occupations.includes(r.onet));assert.ok(r.programs.length);assert.deepEqual(r.programs,p.programs.filter(x=>x.occupations.includes(r.onet)).map(x=>x.cip));assert.equal(education.get(r.soc).occupationType,'Line item');assert.equal(r.education,education.get(r.soc).education);}}
 for(const f of meta.inputs)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(f.file)).digest('hex'),f.sha256,f.file);
});
test('pay figures match pinned Austin rows; missing and suppressed values are unknown without fallback',()=>{
 const entry=new Map(read('shared-data/wages/entry.json').map(r=>[r.soc,r])),median=new Map(read('shared-data/wages/median.json').map(r=>[r.soc,r]));
 for(const rows of Object.values(meta.pathways))for(const r of rows)for(const [key,source] of [['entry',entry],['median',median]]){const v=source.get(r.soc)?.austin;assert.equal(r[key],Number.isFinite(v)&&v>0?v:null);}
 const soil=meta.pathways.environment.find(r=>r.soc==='19-1013');assert.equal(soil.entry,null);assert.equal(soil.median,null);assert.equal(wageRange([{entry:0},{entry:null}],'entry'),null);assert.equal(payScenario(0,lifestyleSnapshot(goal())).status,'missing');
});
test('graduate and experienced destinations never enter initial qualifying-route spans',()=>{
 const d=goal(),software=meta.pathways.software,s=summarizeEarnings(software,d);assert.ok(software.find(r=>r.soc==='11-3021').stage==='experience');assert.ok(software.find(r=>r.soc==='15-1221').stage==='further-study');assert.equal(s.total,3);assert.equal(s.entry.range.high,Math.max(...software.filter(r=>r.stage==='qualifying-route').map(r=>r.entry)));
 for(const rows of Object.values(meta.pathways))for(const r of rows){if(["Master's degree",'Doctoral or professional degree'].includes(r.education))assert.equal(r.stage,'further-study');else if(r.experience!=='None')assert.equal(r.stage,'experience');}
 const movement=meta.pathways.movement;assert.equal(movement.find(r=>r.soc==='29-1123').stage,'further-study');assert.equal(movement.find(r=>r.soc==='29-1031').stage,'further-study');
});
test('monthly pay reproduces the shared employee illustration with health, debts and savings counted once',()=>{
 const d=goal();updateBudget(d,'health','600');updateBudget(d,'debt','350');updateBudget(d,'saving','450');confirmLifestyle(d);const g=lifestyleSnapshot(d),x=payScenario(85000,g),original=calculateLifestyle({...g.inputs,gross:'85000',netMode:'estimate',workMode:'employee',weeklyHours:'40',paidWeeks:'52'});assert.ok(Math.abs(x.remaining-original.remaining)<1e-8);assert.ok(Math.abs(x.takeHome-original.takeHome)<1e-8);assert.ok(Math.abs(x.takeHome-(employeeTaxes(85000,Number(g.inputs.retirement)).monthly-600))<1e-8);
});
test('retirement caps preserve valid high-wage comparisons and spending is not changed',()=>{
 const d=goal();updateBudget(d,'retirement','20');confirmLifestyle(d);const g=lifestyleSnapshot(d),x=payScenario(400000,g);assert.equal(x.retirementCapped,true);const rate=Math.floor(24500/400000*100*1e8)/1e8;assert.equal(x.takeHome,employeeTaxes(400000,rate).monthly-Number(g.inputs.health));assert.equal(x.remaining,x.takeHome-g.result.spending);
});
test('lower pay can fall short, the exact budget threshold covers, and breathing room has a separate threshold',()=>{
 const g=lifestyleSnapshot(goal());assert.equal(payScenario(20000,g).status,'shortfall');assert.equal(payScenario(g.range.minimum+.01,g).status,'covers');assert.equal(payScenario(g.range.breathingRoom+.01,g).status,'breathing-room');
});
test('missing, edited and invalid budgets never create coverage or monthly claims',()=>{
 const d=freshLifestyleDraft();assert.equal(payScenario(75000,lifestyleSnapshot(d)).status,'no-goal');const ready=goal();updateBudget(ready,'rent','2000');const summary=summarizeEarnings(meta.pathways.software,ready);assert.equal(summary.entry.covers,0);assert.ok(summary.entry.scenarios.every(r=>r.status==='no-goal'));const html=earningSummary(paths.find(p=>p.id==='software'),meta,ready);assert.doesNotMatch(html,/of 3 cover/);assert.match(html,/Review your lifestyle/);updateBudget(ready,'rent','');assert.equal(payScenario(75000,lifestyleSnapshot(ready)).status,'no-goal');
});
test('pathway finance is read-only and cannot alter interests, selections or source records',()=>{
 const d=goal(),p=paths.find(p=>p.id==='software'),profile={complete:true,raw:[36,30,10,20,20,20]},before=JSON.stringify({d,meta,paths}),rank=scorePathways(paths,profile);summarizeEarnings(meta.pathways.software,d);earningSummary(p,meta,d);const html=earningsPage(p,meta,d);assert.equal(JSON.stringify({d,meta,paths}),before);assert.deepEqual(scorePathways(paths,profile),rank);assert.match(html,/Monthly budget result:/);assert.match(html,/not an observed starting salary/);assert.match(html,/No statewide or national pay is substituted/);assert.match(html,/Destinations requiring related experience/);assert.doesNotMatch(html,/data-save-career|data-career-choice/);
});
test('one nurse wage group stays one example and variable-earnings omissions remain visible',()=>{
 const d=goal(),n=summarizeEarnings(meta.pathways.nursing,d);assert.equal(n.total,1);assert.equal(n.entry.range.count,1);const a=summarizeEarnings(meta.pathways.arts,d);assert.ok(a.entry.missing>=2);const html=earningsPage(paths.find(p=>p.id==='arts'),meta,d);assert.match(html,/No local annual figure/);assert.match(html,/self-employment is not modeled/);
});
