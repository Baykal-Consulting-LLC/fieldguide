import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {degreeInventory,degreeInventoryMetadata as meta} from '../dist/degree-inventory-data.js';
import {degreeInventoryMatches} from '../dist/degree-inventory-matching.js';
import {degreeMatchInput} from '../dist/degree-inventory-state.js';
import {degreeDiscoverySummary} from '../dist/degree-inventory-review.js';
import {studentModelScreen,studentModelState} from '../dist/student-model-view.js';
const record=degreeInventory.find(o=>o.soc==='17-2011.00'),input={complete:true,flat:false,nearFlat:false,scores:[...record.vector],strengths:[{id:'reasoning',prompt:'Compare explanations',names:[record.skills[0].name]}]};
test('systematic degree inventory preserves exact occupation identity, source vectors and experience requirements',()=>{
 assert.equal(degreeInventory.length,404);assert.equal(new Set(degreeInventory.map(o=>o.soc)).size,404);assert.equal(degreeInventory.filter(o=>o.vector).length,377);assert.equal(degreeInventory.filter(o=>!o.guidedId).length,340);assert.equal(degreeInventory.filter(o=>o.requiresExperience).length,77);
 assert.ok(degreeInventory.some(o=>o.soc==='29-1223.00'));assert.ok(degreeInventory.some(o=>o.soc==='23-1011.00'));assert.ok(degreeInventory.some(o=>o.soc==='17-2041.00'));assert.ok(meta.sourceFiles.every(s=>/^[a-f0-9]{64}$/.test(s.sha256)));
 for(const o of degreeInventory){assert.ok(o.educationBasis&&o.educationMapping&&o.educationURL);if(o.vector)assert.equal(o.vector.length,6);assert.ok(o.url.endsWith(o.soc));assert.equal(Object.hasOwn(o,'salary'),false);assert.equal(Object.hasOwn(o,'aptitude'),false);}
});
test('full-profile ranking is independent of title, degree prestige, salary and reported strength',()=>{
 const a={...record,id:'a',title:'A',guidedId:null,educationGroup:'college',vector:[1,3,2,6,4,5],requiresExperience:false},b={...a,id:'b',title:'B',educationGroup:'graduate',salary:1000000};
 const r=degreeInventoryMatches({...input,scores:a.vector},[a,b]);assert.ok(Math.abs(r.rows[0].r-1)<1e-12);assert.equal(r.rows[0].r,r.rows[1].r);
 const before=JSON.stringify(input);degreeInventoryMatches(input,degreeInventory);assert.equal(JSON.stringify(input),before);
});
test('missing vectors, incomplete and near-flat profiles never get invented strong alignment',()=>{
 const missing={...record,id:'missing',vector:null};assert.equal(degreeInventoryMatches(input,[missing]).rows.length,0);assert.equal(degreeInventoryMatches(input,[missing],{strongOnly:false}).rows[0].r,null);
 for(const overrides of [{complete:false},{flat:true},{nearFlat:true}]){const r=degreeInventoryMatches({...input,...overrides},[record]);assert.equal(r.usable,false);assert.equal(r.rows[0].r,null);}
});
test('education, topic, new-profile and experience filters are transparent selection, not scoring inputs',()=>{
 const rows=degreeInventoryMatches(input,degreeInventory,{strongOnly:false,includeExperienced:true}).rows;
 const grads=degreeInventoryMatches(input,degreeInventory,{strongOnly:false,includeExperienced:true,education:'graduate'}).rows;assert.ok(grads.length);assert.ok(grads.every(o=>o.educationGroup==='graduate'));assert.ok(grads.every(o=>rows.find(x=>x.id===o.id).r===o.r));
 assert.ok(degreeInventoryMatches(input,degreeInventory,{strongOnly:false}).rows.every(o=>!o.requiresExperience));assert.ok(degreeInventoryMatches(input,degreeInventory,{strongOnly:false,onlyNew:true}).rows.every(o=>!o.guidedId));
 const topic=record.specificInterests[0].name;assert.ok(degreeInventoryMatches(input,[record],{topic}).rows.length);assert.ok(degreeInventoryMatches(input,[record],{strengthOnly:true}).rows[0].strengths.length);
});
test('model review and student inventory use the same frozen answers without promoting discovery to Top or lifestyle',()=>{
 const c=JSON.parse(fs.readFileSync('dist/developer/lives/gap-009.json')),before=JSON.stringify(c),s=studentModelState(c),summary=degreeDiscoverySummary(s),r=degreeInventoryMatches(degreeMatchInput(s),degreeInventory);
 assert.equal(summary.groups.reduce((n,g)=>n+g.count,0),r.rows.length);assert.equal(summary.confirmedTop,false);assert.equal(summary.lifestyleAssessed,false);
 const html=studentModelScreen(s,'degree-careers');assert.match(html,/404 sourced career profiles/);assert.match(html,/reflect on three distinct interests/);assert.match(html,/Related reported strengths/);assert.equal(JSON.stringify(c),before);
});
test('public research review preserves the12 zero cases, four visibility cases and sourced established-method distinctions',()=>{
 const d=JSON.parse(fs.readFileSync('research/career-coverage-046/review.json'));assert.equal(d.reviews.length,12);assert.equal(d.reviews.filter(x=>x.notDisplayed).length,4);assert.equal(d.proposals.length,41);assert.equal(new Set(d.proposals.map(x=>x.soc)).size,41);assert.equal(d.established.establishedSystems.length,6);assert.ok(d.reviews.every(r=>r.question&&r.source&&r.examples.length));assert.ok(d.reviews.every(r=>r.examples.every(e=>!e.id.startsWith('private-'))));
});
