import test from 'node:test';
import assert from 'node:assert/strict';
import {occupations} from '../dist/occupation-data.js';
import {collegeProgramOptions,collegeProgramCareerMap} from '../dist/college-program-options.js';
import {collegeProgramPanel,chooseCollegeProgram} from '../dist/college-program-ui.js';
import {freshState,sanitizeState} from '../dist/model.js';
import {personalPlanExport} from '../dist/guide-state.js';
test('all careers have a small explicit set of named, sourced programs',()=>{
 assert.equal(Object.keys(collegeProgramCareerMap).length,occupations.length);
 for(const career of occupations){const r=collegeProgramOptions(career),options=r.categories.flatMap(c=>c.options);assert.ok(options.length>=1&&options.length<=3,career.id);for(const p of options){for(const key of ['title','school','award','relationship','requirementsNote','checkedAt'])assert.ok(p[key],career.id+' '+key);for(const key of ['url','tuitionURL'])assert.equal(new URL(p[key]).protocol,'https:');}}
 assert.equal(collegeProgramOptions('not-a-career').optionCount,0);
});
test('saving programs is optional, career-specific, reversible, and preserved in reload/export',()=>{
 const s=freshState(),option=id=>collegeProgramOptions(id).categories[0].options[0].id;
 assert.equal(chooseCollegeProgram(s,'physician',option('graphic-design')),false);
 for(const id of ['physician','graphic-design'])assert.ok(chooseCollegeProgram(s,id,option(id)));
 s.guide.primaryCareer='physician';const saved=sanitizeState(JSON.parse(JSON.stringify(s)));
 assert.deepEqual(saved.guide.programChoices,s.guide.programChoices);
 const exported=personalPlanExport(saved);assert.equal(exported.selectedProgramId,option('physician'));assert.equal(exported.programChoices['graphic-design'],option('graphic-design'));
 assert.match(collegeProgramPanel(saved,'physician',{selectable:true,plan:true}),/My program to explore/);
 assert.ok(chooseCollegeProgram(saved,'physician',option('physician')));assert.equal(saved.guide.programChoices.physician,undefined);assert.ok(saved.guide.programChoices['graphic-design']);
});
test('information-only library has no guided saving and related study is not claimed as qualification',()=>{
 const s=freshState();assert.doesNotMatch(collegeProgramPanel(s,'physician'),/data-action="guide-program"/);
 assert.match(collegeProgramPanel(s,'janitor-cleaner'),/Optional related study or advancement/);
 assert.match(collegeProgramPanel(s,'psychiatric-technician'),/not a job-specific qualification/);
 assert.match(collegeProgramPanel(s,'vocational-nurse'),/different licensed role/);
 assert.match(collegeProgramPanel(s,'law'),/not a required pre-law major/);
});
