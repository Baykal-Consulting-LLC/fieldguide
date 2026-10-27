import test from 'node:test';
import assert from 'node:assert/strict';
import {studentExamples,exampleState,exampleResult,studentExamplesPage} from '../dist/student-examples.js';
import {freshState,sanitizeState} from '../dist/model.js';
import {careerOptions,createPlanActions,salaryPreviewInputs} from '../dist/guide-state.js';
import {guidePage,personalPlanPage} from '../dist/guide-ui.js';
import {careerLifestyleFit} from '../dist/lifestyle-story.js';
import {salaryPanel} from '../dist/salary-ui.js';
for(const e of studentExamples)test(`${e.id}: coherent field, ordered tasks, distinct plan, honest early budget`,()=>{
 const {s,fields,matches,room,stress}=exampleResult(e.id);assert.equal(fields[0].id,e.family);assert.deepEqual(matches.map(o=>o.id),e.careers);assert.equal(Object.keys(s.curiosity).length,30);assert.equal(s.guide.completed,true);assert.equal(s.actions.length,3);assert.ok(s.actions.every(a=>a.careerId===e.careers[0]));assert.equal(sanitizeState(s).guide.salaryStage,e.stage);assert.equal(sanitizeState(s).finance.lifestyle.gross,s.finance.lifestyle.gross);assert.ok(stress.result.remaining<=room.result.remaining);assert.match(personalPlanPage(s),new RegExp(e.careers[0]==='physician'?'resident':e.careers[0]==='electrician'?'apprentice':e.careers[0]==='dentist'?'DDS or DMD':'Graphic design','i'));
 if(['creative','trades'].includes(e.id))assert.ok(room.result.remaining<0);if(e.id==='medicine'){assert.equal(Number(s.finance.lifestyle.gross),69528);assert.ok(room.result.remaining<500);assert.ok(stress.result.remaining<0);}
 const before=JSON.stringify(s),preview=salaryPreviewInputs(s,e.careers[0],e.stage);assert.equal(JSON.stringify(s),before);assert.equal(preview.gross,s.finance.lifestyle.gross);
 s.confidence={data:{exposure:'new',confidence:1}};s.finance.lifestyle.gross='300000';assert.deepEqual(careerOptions(s).slice(0,3).map(o=>o.id),e.careers);
 s.actions[0].detail='My own next step';createPlanActions(s);assert.equal(s.actions[0].detail,'My own next step');assert.equal(s.actions.length,3);
 const page=studentExamplesPage(e.id);assert.match(page,/Read-only examples/);assert.doesNotMatch(page,/data-action=|data-evidence=|data-reflection=/);assert.match(page,/not a validated aptitude test/);
});
test('task choices stay in place after selecting an interest',()=>{const s=exampleState('dentistry');const selected=guidePage('guide/work-fit',s).match(/data-id="work:[^"]+/g);s.guide.taskInterests=[];assert.deepEqual(guidePage('guide/work-fit',s).match(/data-id="work:[^"]+/g),selected);});
test('paid training is visible before qualified pay and lifestyle fit uses the earliest paid stage',()=>{for(const [id,stage]of [['physician','residency'],['electrician','apprenticeship']]){const html=salaryPanel(id,{stage});assert.match(html,/Paid residency comes first|Paid apprenticeship comes first/);assert.match(html,/My Plan uses paid training/);const s=freshState();s.guide.lifestylePreset='alone';const fit=careerLifestyleFit(s,id);assert.equal(fit.stages[0].key,stage);}});
