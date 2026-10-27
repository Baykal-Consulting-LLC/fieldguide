import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,sanitizeState} from '../dist/model.js';
import {startGuide,toggleGuideFamily,toggleGuidePath,selectedFamilies,selectedPaths,specialtyOptions,careerOptions,pathCareerIds,salaryPreviewInputs,selectCareer,createPlanActions,personalPlanExport} from '../dist/guide-state.js';
import {guidePage,salaryPreviewPage,personalPlanPage} from '../dist/guide-ui.js';
import {salaryPanel} from '../dist/salary-ui.js';
import {salaryAtStage,salaryCareerIds} from '../dist/salary-progression.js';
import {calculateLifestyle} from '../dist/lifestyle.js';
import {analyze} from '../dist/analysis.js';

test('students can combine interests and specialties, with a clear three-choice limit',()=>{
 const s=freshState();startGuide(s,'careers');const before=analyze(s);
 for(const f of ['creative','technology','health'])assert.ok(toggleGuideFamily(s,f));
 assert.equal(toggleGuideFamily(s,'science'),false);assert.deepEqual(selectedFamilies(s.guide),['creative','technology','health']);
 for(const p of ['design','technology','social-support'])assert.ok(toggleGuidePath(s,p));
 assert.equal(toggleGuidePath(s,'health'),false);
 const options=careerOptions(s).map(o=>o.id);for(const path of selectedPaths(s.guide))for(const id of pathCareerIds(path))assert.ok(options.includes(id));
 assert.equal(new Set(options).size,options.length);assert.deepEqual(analyze(s),before);
 assert.ok(toggleGuideFamily(s,'technology'));assert.deepEqual(selectedPaths(s.guide),['design','social-support']);assert.ok(!specialtyOptions(s).some(d=>d.id==='technology'));
 const restored=sanitizeState(s);assert.deepEqual(restored.guide.familyIds,s.guide.familyIds);assert.deepEqual(restored.guide.pathIds,s.guide.pathIds);
 selectCareer(s,'industrial-design');createPlanActions(s);assert.match(personalPlanPage(s),/Why this matches you/);assert.deepEqual(personalPlanExport(s).interests.paths,['design','social-support']);
});
test('single-choice legacy drafts migrate to multi-interest data and invalid entries are removed',()=>{
 const s=sanitizeState({version:1,guide:{entry:'careers',family:'creative',path:'design'}});assert.deepEqual(s.guide.familyIds,['creative']);assert.deepEqual(s.guide.pathIds,['design']);
 const bad=sanitizeState({version:1,guide:{familyIds:['creative','fake','creative'],pathIds:['design','fake','design']}});assert.deepEqual(bad.guide.familyIds,['creative']);assert.deepEqual(bad.guide.pathIds,['design']);
});
test('college and non-college choices respect preparation filters after combining interests',()=>{
 for(const entry of ['college','training']){const s=freshState();startGuide(s,entry);toggleGuideFamily(s,'creative');for(const p of specialtyOptions(s).slice(0,3))toggleGuidePath(s,p.id);for(const c of careerOptions(s))assert.equal(c.finance.routeType==='training',entry==='training');}
});
test('every career and each of four stages links directly to a precise, non-mutating Austin lifestyle',()=>{
 const s=freshState();selectCareer(s,'software');s.finance.lifestyle.netMode='manual';s.finance.lifestyle.manualNet='88888';createPlanActions(s);
 const before=JSON.stringify(s);
 for(const id of salaryCareerIds){const html=salaryPanel(id,{from:'plan'});assert.equal((html.match(/class="salary-lifestyle-link"/g)||[]).length,['physician','electrician','police','firefighter'].includes(id)?5:4);
 for(const stage of ['entry','year5','year10','year20']){assert.match(html,new RegExp(`#/salary/${id}/${stage}\\?from=plan`));const p=salaryPreviewInputs(s,id,stage);assert.equal(Number(p.gross),salaryAtStage(id,stage));assert.equal(p.netMode,'estimate');const result=calculateLifestyle(p);assert.equal(result.status,'illustration');assert.notEqual(result.takeHome,88888);const preview=salaryPreviewPage(id,stage,s,'plan');assert.match(preview,/Preview only. Your saved plan is unchanged/);assert.match(preview,/Every dollar/);assert.doesNotMatch(preview,/data-action="life-adjust"/);assert.match(preview,/data-action="guide-keep-salary"/);}
 }assert.equal(JSON.stringify(s),before);
});
test('all preview return routes are usable and invalid salary links have direct recovery',()=>{
 const s=freshState();selectCareer(s,'software');for(const [from,route] of Object.entries({career:'career/software','guided-career':'guide/career/software',income:'guide/income',plan:'plan',careers:'guide/careers'}))assert.ok(salaryPreviewPage('software','year5',s,from).includes('href="#/'+route+'"'));
 for(const [id,stage]of [['no-such-career','entry'],['software','year999']])assert.match(salaryPreviewPage(id,stage,s),/Choose a career/);
 assert.doesNotMatch(salaryPreviewPage('software','entry',s,'<script>'),/<script>/);
 assert.match(guidePage('guide/careers',freshState()),/Choose interests/);
});

 test('guided journey has five reflection sections and excludes exam exercises without discarding old data',async()=>{
 const {modules,challenges}=await import('../dist/content.js');const s=freshState();assert.equal(modules.length,5);assert.ok(!modules.some(m=>m.id==='challenges'));s.challenges[challenges[0].id]=1;const restored=sanitizeState(s);assert.equal(restored.challenges[challenges[0].id],1);const page=guidePage('guide/assessment',s);assert.match(page,/Five short sections/);assert.doesNotMatch(page,/activity\/challenges|small problems|reasoning/);
 });
 test('automatically skip screens when interests lead to a single role or area',async()=>{
 const {advanceInterests,advanceSpecialties}=await import('../dist/guide-state.js');const s=freshState();startGuide(s,'training');toggleGuideFamily(s,'creative');assert.equal(advanceInterests(s),'guide/specialty');assert.equal(s.guide.candidate,'');s.guide.pathIds=['design'];s.guide.path='design';assert.equal(advanceSpecialties(s),'guide/career/tattoo');
 const t=freshState();startGuide(t,'training');toggleGuideFamily(t,'trades');assert.equal(advanceInterests(t),'guide/work-fit');assert.ok(t.guide.pathIds.length===1);
 });

 test('salary previews cap large retirement choices without floating-point overflow or invalid saved budgets',()=>{
 const s=freshState();s.finance.lifestyle.retirement='80';for(const id of salaryCareerIds)for(const stage of ['entry','year5','year10','year20']){const p=salaryPreviewInputs(s,id,stage);assert.ok(Number(p.gross)*Number(p.retirement)/100<=24500);assert.equal(calculateLifestyle(p).status,'illustration');}
 });
