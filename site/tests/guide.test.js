import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,sanitizeState} from '../dist/model.js';
import {entryPoints,freshGuide,cleanGuide,startGuide,availableFamilies,familyPaths,pathCareerIds,routeCareers,careerOptions,selectCareer,applyGuidePay,createPlanActions,personalPlanExport,applyLifestylePreset,requiredGross,lifestylePreset,suggestedPaths} from '../dist/guide-state.js';
import {guideHome,guidePage,personalPlanPage,simpleCareerPage} from '../dist/guide-ui.js';
import {salaryAtStage,salaryCareerIds} from '../dist/salary-progression.js';
import {salaryPanel} from '../dist/salary-ui.js';
import {calculateLifestyle,employeeTaxes} from '../dist/lifestyle.js';
import {analyze} from '../dist/analysis.js';

test('one full assessment and exactly five simple entry points',()=>{
 assert.deepEqual(entryPoints.map(e=>e.id),['assessment','lifestyle','college','training','careers','income']);const html=guideHome(freshState());assert.equal((html.match(/data-action="guide-start"/g)||[]).length,6);assert.match(html,/FULL GUIDED JOURNEY/);assert.doesNotMatch(html,/Quick exploration|Choose how you want to explore/);
});
test('every reviewed career remains reachable through the guided hierarchy in all appropriate routes',()=>{
 for(const entry of entryPoints){const s=freshState();assert.ok(startGuide(s,entry.id));const reached=new Set();for(const family of availableFamilies(s)){s.guide.family=family.id;for(const path of familyPaths(s,family.id)){s.guide.path=path.id;const opts=careerOptions(s);assert.ok(opts.length);opts.forEach(o=>reached.add(o.id));}}
 for(const o of routeCareers(s))assert.ok(reached.has(o.id),entry.id+': '+o.id);}
});
test('all six entries converge on the same personal-plan state without changing assessment results',()=>{
 for(const entry of entryPoints){const s=freshState(),before=analyze(s);startGuide(s,entry.id);const o=routeCareers(s)[0];assert.ok(selectCareer(s,o.id));applyGuidePay(s);createPlanActions(s);assert.equal(s.guide.primaryCareer,o.id);assert.equal(s.guide.lastRoute,'plan');assert.equal(s.guide.completed,true);assert.equal(s.actions.length,3);assert.deepEqual(analyze(s),before);assert.match(personalPlanPage(s),/Top matches/);}
});
test('new guide data and legacy drafts migrate without dropping existing answers, budgets, or actions',()=>{
 const s=freshState();s.curiosity['curiosity-1']=5;s.finance.lifestyle.rent='1234';s.actions=[{id:'old',title:'Keep my old action',detail:'Original notes',done:false}];s.guide={...freshGuide(),entry:'income',incomeTarget:'80000',primaryCareer:'software',careerIds:['software'],salaryStage:'year10',lastRoute:'guide/life'};
 const restored=sanitizeState(s);assert.equal(restored.curiosity['curiosity-1'],5);assert.equal(restored.finance.lifestyle.rent,'1234');assert.equal(restored.actions[0].detail,'Original notes');assert.deepEqual(restored.guide,s.guide);assert.deepEqual(sanitizeState({version:1}).guide,freshGuide());
 const bad=cleanGuide({entry:'evil',primaryCareer:'unknown',careerIds:['software','unknown','software'],lastRoute:'javascript:alert(1)',incomeTarget:'Infinity'});assert.equal(bad.entry,'');assert.equal(bad.primaryCareer,'');assert.equal(bad.incomeTarget,'');assert.equal(bad.lastRoute,'');assert.deepEqual(bad.careerIds,['software']);
});
test('main career and two alternatives stay explicit and preserve earlier saved careers',()=>{
 const s=freshState();s.exploration.savedCareers=['writing'];selectCareer(s,'software');assert.ok(selectCareer(s,'nursing',{alternative:true}));assert.ok(selectCareer(s,'electrician',{alternative:true}));assert.equal(selectCareer(s,'law',{alternative:true}),false);assert.equal(s.guide.primaryCareer,'software');assert.ok(s.exploration.savedCareers.includes('writing'));selectCareer(s,'electrician');assert.deepEqual(s.guide.careerIds,['electrician','software','nursing']);
});
test('all65careers and all4salary stages feed fullprecision pay into a viable lifestyle budget',()=>{
 for(const id of salaryCareerIds)for(const stage of ['entry','year5','year10','year20']){const s=freshState();selectCareer(s,id);s.guide.salaryStage=stage;applyGuidePay(s);assert.equal(Number(s.finance.lifestyle.gross),salaryAtStage(id,stage));assert.equal(calculateLifestyle(s.finance.lifestyle).status,'illustration',id+': '+stage);}
 const s=freshState();selectCareer(s,'software');s.guide.salaryStage='custom';s.finance.lifestyle.gross='65432';applyGuidePay(s);assert.equal(s.finance.lifestyle.gross,'65432');assert.equal(sanitizeState(s).guide.salaryStage,'custom');selectCareer(s,'software');assert.equal(s.guide.salaryStage,'custom');
});
test('goal calculations reconcile with an independent employee take-home check and do not enter aptitude analysis',()=>{
 for(const key of ['shared','alone','comfort']){const s=freshState(),before=analyze(s);startGuide(s,'lifestyle');applyLifestylePreset(s,key);const p=s.finance.lifestyle,r=calculateLifestyle(p),gross=requiredGross(p);assert.ok(gross>0);const net=employeeTaxes(gross,Number(p.retirement)).monthly-Number(p.health);assert.ok(Math.abs(net-r.spending)<.001);assert.deepEqual(analyze(s),before);assert.equal(s.guide.lifestylePreset,key);}
});
test('salary headline and timelines always disclose estimates; statistical detail stays optional',()=>{
 for(const id of salaryCareerIds){const html=salaryPanel(id);assert.match(html,/ENTRY-LEVEL PAY/);assert.match(html,/5 years/);assert.match(html,/10 years/);assert.match(html,/20 years/);assert.match(html,/Estimated pay|Estimated starting pay|[Ll]ow.confidence|Published employer pay example/);assert.match(html,/<details class="more-info">/);assert.doesNotMatch(html,/Lower quarter|Upper quarter/);}
 const html=simpleCareerPage('electrician',freshState());assert.match(html,/A construction-management degree can prepare you to manage building projects/);
});
test('plan creation is idempotent, next steps remain editable, and budget exports require explicit choice',()=>{
 const s=freshState();selectCareer(s,'software');s.finance.lifestyle.notes='PRIVATE BUDGET';createPlanActions(s);createPlanActions(s);assert.equal(s.actions.length,3);assert.equal(s.guide.completed,true);assert.doesNotMatch(JSON.stringify(personalPlanExport(s)),/PRIVATE BUDGET/);s.guide.includeFinance=true;assert.match(JSON.stringify(personalPlanExport(s)),/PRIVATE BUDGET/);
 s.actions[0].detail='<img src=x onerror=bad()>';assert.match(personalPlanPage(s),/&lt;img/);assert.doesNotMatch(personalPlanPage(s),/<img src=x/);
});
test('original curiosity links are transparent editorial prompts and do not use confidence or challenge scores',()=>{
 const s=freshState();for(const q of [1,7,13])s.curiosity['curiosity-'+q]=5;assert.deepEqual(suggestedPaths(s),[]);for(let n=1;n<=30;n++)if(!s.curiosity['curiosity-'+n])s.curiosity['curiosity-'+n]=2;assert.ok(suggestedPaths(s).includes('skilled-trades'));const before=suggestedPaths(s);s.confidence.making={exposure:'new',confidence:1};s.challenges.pattern=0;assert.deepEqual(suggestedPaths(s),before);
});

 test('every reviewed career has concrete Texas preparation and renders all core guide panels',async()=>{
 const {texasRequirements}=await import('../dist/texas-requirements.js');
 for(const id of salaryCareerIds){const t=texasRequirements[id];assert.ok(t?.summary,id);assert.ok(t.bullets.length>=2,id);assert.ok(t.sourceURLs.length,id);const s=freshState();selectCareer(s,id);for(const route of ['education','income','life','next'])assert.ok(guidePage('guide/'+route,s).length>200,id+route);}
 assert.match(texasRequirements['clinical-psychologist'].bullets.join(' '),/3,500/);
});
