import test from 'node:test';
import assert from 'node:assert/strict';
import {runStudentModels,frozenPayloadHash} from '../scripts/calibrate-student-models.mjs';
import {studentModelMetadata} from '../calibration/student-models-032.js';
test('frozen narrative models complete the shorter flow without using experience or money as interest',async()=>{
 assert.equal(frozenPayloadHash(),studentModelMetadata.answerPayloadSHA256);
 const r=await runStudentModels();assert.equal(r.coverage.students,24);assert.equal(r.coverage.families,12);assert.equal(r.coverage.officialAnswers,1440);
 const get=id=>r.students.find(s=>s.id==='m32-'+id);
 for(const id of ['still-exploring','many-positive']){const s=get(id);assert.equal(s.core.careers.length,0);assert.equal(s.plan,null);}
 const food=get('food-without-sales');assert.ok(food.core.careers.some(c=>c.id==='restaurant-cook'));assert.ok(food.core.careers.some(c=>c.id==='chef'));
 const salon=get('salon-listener');assert.ok(salon.core.careers.some(c=>c.id==='hairdresser'));assert.ok(salon.core.careers.find(c=>c.id==='hairdresser').correlation<0);
 const biology=get('biology-stories');assert.ok(biology.core.otherSupported.some(c=>c.id==='writing'));
 for(const s of r.students){assert.ok(s.totalChoiceScreens<110);assert.ok(s.checks.length>=5);}
});
