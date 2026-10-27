import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshReflection,cleanReflection,reflectionProgress,setSubjectAnswer,orderReflectedPathways,subjectSuggestions,subjectQuestions} from '../dist/subject-reflection.js';
import {subjectPage,subjectStrip} from '../dist/subject-reflection-ui.js';
import {scorePathways,cleanDraft,freshDraft} from '../dist/engine.js';
import {discoveryPage} from '../dist/discovery-ui.js';
const data=JSON.parse(fs.readFileSync('dist/data/pathways.json')),ids=data.pathways.map(p=>p.id);
const base=scorePathways(data.pathways,{complete:true,raw:[16,34,22,30,26,24],flat:false,nearFlat:false});
const order=rows=>rows.map(p=>p.id);
const draft=choices=>{const d=freshReflection();for(const[q,v]of Object.entries(choices))for(const option of Array.isArray(v)?v:[v])assert.equal(setSubjectAnswer(d,q,option),true);return d;};
test('v1 broad subject choices survive migration without silently becoming narrow interests',()=>{
 const original={version:1,answers:{classes:{status:'selected',choices:['organizations']},practice:{status:'selected',choices:['case']},investigate:{status:'selected',choices:['meaning']},reading:{status:'selected',choices:['culture']}}};
 const migrated=cleanReflection(original);assert.equal(migrated.version,2);assert.deepEqual(migrated.answers,original.answers);assert.equal(reflectionProgress(migrated).legacy,4);assert.equal(reflectionProgress(migrated).directional,0);
 const rows=orderReflectedPathways(base,migrated);assert.equal(rows[0].subjectStatus,'needs-answers');assert.deepEqual(order(rows),order(base));assert.ok(rows.every(p=>p.subjectConnections===0));
 const page=subjectPage(migrated,'0',base);assert.match(page,/Business, economics and public life/);assert.match(page,/Your saved earlier choice/);assert.match(subjectPage(migrated,'summary',base),/earlier broad choices are not silently narrowed/i);
 const state={...freshDraft(),reflection:original,saved:['design'],notes:{design:'Keep this note'}};const restored=cleanDraft(state,ids);assert.deepEqual(restored.reflection.answers,original.answers);assert.deepEqual(restored.saved,state.saved);assert.deepEqual(restored.notes,state.notes);
});
test('two explicit policy choices suggest only linked policy directions, without unrelated filler',()=>{
 const d=draft({classes:'civics',practice:'policy-case'}),rows=orderReflectedPathways(base,d),shown=subjectSuggestions(rows);
 assert.equal(rows[0].subjectActive,true);assert.equal(shown.length,3);assert.deepEqual(order(shown).sort(),['legal','public-service','society']);assert.ok(shown.every(p=>p.subjectConnections===2));assert.equal(rows.length,36);
 const html=discoveryPage({data,occupations:{},sources:{collegeRelevant:829},profile:{complete:false},areaFilter:'all',query:'',browseAll:false,reflection:d,card:p=>`<article data-path="${p.id}"></article>`,lifestyle:'',profileStrip:'',earningsIntro:''});
 assert.match(html,/3 starting points/);assert.equal((html.match(/data-path=/g)||[]).length,3);
});
test('language and cultural choices do not fabricate an interest in religion or performance',()=>{
 const d=draft({classes:'language',project:'text',investigate:'culture-study',practice:'text-study',team:'interpret',quantitative:'evidence',reading:'humanities',next:'language'}),rows=orderReflectedPathways(base,d),shown=subjectSuggestions(rows);
 assert.ok(shown.some(p=>p.id==='humanities'));assert.ok(shown.some(p=>p.id==='society'));assert.ok(!shown.some(p=>['faith','arts','finance'].includes(p.id)));assert.equal(rows.find(p=>p.id==='faith').subjectConnections,0);
});
test('explicit religious study remains available when that is what a student chooses',()=>{
 const rows=orderReflectedPathways(base,draft({classes:'belief',investigate:'belief',reading:'belief',next:'belief'}));assert.ok(subjectSuggestions(rows).some(p=>p.id==='faith'));assert.ok(rows.find(p=>p.id==='faith').subjectConnections>=4);
});
test('broad ties defer ordering and general reasoning alone cannot create a subject direction',()=>{
 const tied=draft({classes:'business',practice:'business-case'}),rows=orderReflectedPathways(base,tied);assert.equal(rows[0].subjectStatus,'broad-tie');assert.equal(rows[0].subjectTieCount,5);assert.deepEqual(order(rows),order(base));assert.match(subjectPage(tied,'summary',base),/connect equally to many directions/);
 const general=draft({quantitative:'evidence',classes:'unsure',practice:'skipped'});assert.equal(reflectionProgress(general).substantive,1);assert.equal(reflectionProgress(general).directional,0);assert.deepEqual(order(orderReflectedPathways(base,general)),order(base));
});
test('explicit mixed areas survive every single-answer omission in the science/design regression',()=>{
 const d=draft({classes:['living','studio'],project:['field','story'],investigate:['places','stories'],practice:['lab','studio'],team:['context','communicate'],quantitative:['measure','space'],reading:['science','arts-culture'],next:['nature','create']});
 for(const omitted of [null,...subjectQuestions.map(q=>q.id)]){const copy=structuredClone(d);if(omitted)delete copy.answers[omitted];const rows=orderReflectedPathways(base,copy),shown=subjectSuggestions(rows);assert.equal(rows[0].subjectDiversified,true,omitted);assert.equal(shown.filter(p=>p.area==='science').length,2,omitted);assert.equal(shown.filter(p=>p.area==='creative').length,2,omitted);assert.equal(new Set(rows.map(p=>p.id)).size,36);}
});
test('one multi-choice question cannot trigger the mixed-area rule',()=>{
 const d=draft({project:['field','story'],classes:'studio',practice:'studio'}),rows=orderReflectedPathways(base,d);assert.equal(rows[0].subjectDiversified,false);
});
test('pausing the subject lens restores broad order and keeps every answer for comparison',()=>{
 const d=draft({classes:'civics',practice:'policy-case'}),answers=structuredClone(d.answers);d.useForSuggestions=false;const restored=cleanReflection(d),rows=orderReflectedPathways(base,restored);
 assert.deepEqual(order(rows),order(base));assert.equal(rows[0].subjectStatus,'paused');assert.deepEqual(restored.answers,answers);assert.equal(restored.useForSuggestions,false);assert.match(subjectStrip(restored,rows),/Your subject answers are kept/);assert.match(subjectPage(restored,'summary',base),/Use my subject choices again/);
 restored.useForSuggestions=true;assert.equal(orderReflectedPathways(base,restored)[0].subjectActive,true);
});
