import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {freshReflection,setSubjectAnswer,cleanReflection,orderReflectedPathways,subjectSuggestions,subjectReviewQueue,subjectQuestions} from '../dist/subject-reflection.js';
import {subjectPage,subjectMethod} from '../dist/subject-reflection-ui.js';import {scorePathways,freshDraft,cleanDraft} from '../dist/engine.js';
const paths=JSON.parse(fs.readFileSync('dist/data/pathways.json')).pathways,base=scorePathways(paths,{complete:true,raw:[20,34,22,34,22,24]}),ids=x=>x.map(p=>p.id),draft=c=>{const d=freshReflection();for(const[q,v]of Object.entries(c))for(const o of [].concat(v))assert.equal(setSubjectAnswer(d,q,o),true);return d;};
const examples=[
 [{classes:['code','people'],project:['app','support'],practice:['debug','care'],next:['digital','serve']},['software','data','it'],['education','psychology','social']],
 [{classes:['living','physical'],project:['support','device'],practice:['care','workshop'],next:['serve','build']},['nursing','allied','health-professional'],['electrical','mechanical','applied-technology']],
 [{classes:['physical','civics'],project:['device','support'],practice:['workshop','care'],team:['coordinate','include']},['construction','civil','applied-technology'],['public-service','social','education']]
];
test('repeated mixed choices retain both directions across broad area boundaries',()=>{
 for(const [i,[c,a,b]] of examples.entries()){const localBase=scorePathways(paths,{complete:true,raw:[[20,34,22,34,22,24],[32,34,14,34,20,28],[38,26,18,36,26,26]][i]}),d=draft(c),before=structuredClone(d),rows=orderReflectedPathways(localBase,d),shown=subjectSuggestions(rows);assert.equal(rows[0].subjectDiversityBasis,'directions');assert.ok(shown.some(p=>a.includes(p.id)));assert.ok(shown.some(p=>b.includes(p.id)));assert.ok(shown.every(p=>p.subjectConnections>=2));assert.equal(new Set(ids(rows)).size,36);assert.deepEqual(d,before);assert.ok(rows.every(p=>p.score===localBase.find(x=>x.id===p.id).score));}
});
test('mixed direction support records distinct questions and disjoint justified groups',()=>{
 const rows=orderReflectedPathways(base,draft(examples[0][0])),state=rows[0];assert.ok(state.subjectMixedQuestions.length>=2);assert.equal(new Set(state.subjectMixedQuestions).size,state.subjectMixedQuestions.length);const[a,b]=state.subjectMixedDirections;assert.ok(a.length&&b.length);assert.ok(!a.some(id=>b.includes(id)));for(const group of [a,b])for(const id of group)assert.ok(rows.find(p=>p.id===id).subjectConnections>=2);
 assert.match(subjectPage(draft(examples[0][0]),'summary',base),/two distinct study directions/);assert.match(subjectMethod(paths),/One two-choice question cannot trigger/);
});
test('one mixed question, unknowns, old broad options and general reasoning cannot fabricate repeated groups',()=>{
 for(const d of [draft({classes:['code','people'],project:'unsure',practice:'skipped'}),draft({classes:['organizations','code'],practice:'case',quantitative:'evidence'}),draft({classes:['code','people'],practice:'debug'})]){const rows=orderReflectedPathways(base,d);assert.notEqual(rows[0].subjectDiversityBasis,'directions');}
});
test('choice order is immaterial and pausing keeps the original broad order with all answers saved',()=>{
 const c=examples[0][0],d=draft(c),flipped=draft(Object.fromEntries(Object.entries(c).map(([q,v])=>[q,v.slice().reverse()])));assert.deepEqual(ids(orderReflectedPathways(base,d)),ids(orderReflectedPathways(base,flipped)));
 const before=structuredClone(d.answers);d.useForSuggestions=false;const paused=orderReflectedPathways(base,d);assert.deepEqual(ids(paused),ids(base));assert.equal(paused[0].subjectDiversityBasis,null);assert.deepEqual(d.answers,before);
});
test('new project and practice choices distinguish course interests without retiring or rewriting prior answers',()=>{
 const old=draft({project:'support',practice:'business-case'}),snapshot=structuredClone(old);assert.deepEqual(cleanReflection(old),snapshot);assert.equal(subjectReviewQueue(old).length,0);
 for(const[q,id,target]of [['project','lesson','education'],['project','community-access','social'],['practice','hospitality-service','hospitality']]){const option=subjectQuestions.find(x=>x.id===q).options.find(o=>o.id===id);assert.ok(option.paths.includes(target));const d=draft({[q]:id});assert.deepEqual(ids(orderReflectedPathways(base,d)),ids(base));const state={...freshDraft(),reflection:d,saved:['design'],notes:{design:'Keep me'}};assert.deepEqual(cleanDraft(state,paths.map(p=>p.id)),state);}
 const signature=id=>subjectQuestions.flatMap(q=>q.options.filter(o=>o.paths.includes(id)).map(o=>q.id+':'+o.id));assert.notDeepEqual(signature('social'),signature('education'));assert.notDeepEqual(signature('management'),signature('hospitality'));
});

test('changing broad interests still reserves one from each detected explicit direction group',()=>{
 for(const[c]of examples)for(const raw of [[38,22,14,18,20,24],[14,38,22,20,18,24],[14,22,38,24,20,18],[14,22,20,38,24,18],[14,22,20,24,38,26],[18,24,14,20,26,38]]){const rows=orderReflectedPathways(scorePathways(paths,{complete:true,raw}),draft(c)),shown=subjectSuggestions(rows);assert.equal(rows[0].subjectDiversityBasis,'directions');for(const group of rows[0].subjectMixedDirections)assert.ok(shown.some(p=>group.includes(p.id)));}
});
