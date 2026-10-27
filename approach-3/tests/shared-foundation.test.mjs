import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {onetQuestions,onetResponseOptions,onetInstrument,scoreOnetInterest} from '../dist/onet-assessment.js';
test('official assessment wording, options, scoring and license stay intact',()=>{
 const source=JSON.parse(fs.readFileSync(new URL('../shared-data/assessment/questions.json',import.meta.url))).response;
 assert.deepEqual(onetQuestions.map(q=>q.text),source.question.map(q=>q.text));
 assert.deepEqual(onetResponseOptions.map(o=>o.value),source.answer_option.map(o=>o.value));
 assert.equal(onetQuestions.length,60);assert.match(onetInstrument.attribution,/CC BY-ND 4.0/);
 const answers=Object.fromEntries(onetQuestions.map(q=>[q.id,{R:1,I:2,A:3,S:4,E:5,C:3}[q.theme]]));
 assert.deepEqual(scoreOnetInterest({profileJourney:{officialInterest:{instrument:onetInstrument.id,version:onetInstrument.version,answers}}}).raw,[0,10,20,30,40,20]);
 assert.equal(scoreOnetInterest({profileJourney:{officialInterest:{instrument:onetInstrument.id,version:onetInstrument.version,answers:{}}}}).complete,false);
});
test('consumer identity and state do not reuse either original Site',()=>{
 const c=JSON.parse(fs.readFileSync(new URL('../.openai/hosting.json',import.meta.url)));
 assert.equal(c.project_id,'appgprj_6add9e5381fc819194373e25934a0e3a');
 assert.notEqual(c.project_id,'appgprj_6ad2290682f48191aa3af4294c080f91');
 assert.notEqual(c.project_id,'appgprj_6adad06b94a48191ac15104645bcbf69');
 assert.equal(c.d1,undefined);assert.equal(c.r2,undefined);
});
