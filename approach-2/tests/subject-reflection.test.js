import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshReflection,cleanReflection,subjectQuestions,setSubjectAnswer,reflectionProgress,orderReflectedPathways,jordanSubjectReflection} from '../dist/subject-reflection.js';
import {subjectPage,pathwayReason,stretchFor,subjectMethod} from '../dist/subject-reflection-ui.js';
import {freshDraft,cleanDraft,scorePathways} from '../dist/engine.js';
import {makeSampleDraft,sampleInterest,persistForMode,journeySteps,journeyStepFor} from '../dist/sample-journey.js';
import {discoveryPage} from '../dist/discovery-ui.js';
const data=JSON.parse(fs.readFileSync('dist/data/pathways.json')),ids=data.pathways.map(p=>p.id);
const student=makeSampleDraft(),baseline=scorePathways(data.pathways,sampleInterest(student));
const order=rows=>rows.map(p=>p.id);
test('eight original prompts map only real pathways and leave all pathways discoverable',()=>{
 assert.equal(subjectQuestions.length,8);assert.equal(new Set(subjectQuestions.map(q=>q.id)).size,8);
 const mapped=new Set();for(const q of subjectQuestions){assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);for(const o of q.options)for(const id of o.paths){assert.ok(ids.includes(id),id);mapped.add(id);}}
 assert.deepEqual([...mapped].sort(),ids.slice().sort());
 const reflected=orderReflectedPathways(baseline,jordanSubjectReflection());assert.equal(reflected.length,36);assert.deepEqual(order(reflected).sort(),ids.slice().sort());
});
test('old drafts survive migration and subject edits cannot rewrite official scores, lifestyle or shortlist',()=>{
 const old=structuredClone(student);delete old.reflection;const d=cleanDraft(old,ids);assert.deepEqual(d.reflection,freshReflection());
 const official=sampleInterest(d),lifestyle=structuredClone(d.lifestyle),saved=[...d.saved],notes=structuredClone(d.notes);
 d.reflection=jordanSubjectReflection();const restored=cleanDraft(JSON.parse(JSON.stringify(d)),ids);
 assert.deepEqual(restored.reflection,d.reflection);assert.deepEqual(sampleInterest(restored),official);assert.deepEqual(restored.lifestyle,lifestyle);assert.deepEqual(restored.saved,saved);assert.deepEqual(restored.notes,notes);
});
test('unknown and skipped answers have no preferences, invalid choices are dropped, selection is capped at two',()=>{
 const d=freshReflection();assert.equal(setSubjectAnswer(d,'classes','code'),true);assert.equal(setSubjectAnswer(d,'classes','physical'),true);assert.equal(setSubjectAnswer(d,'classes','studio'),false);
 assert.equal(setSubjectAnswer(d,'classes','code'),true);assert.deepEqual(d.answers.classes.choices,['physical']);
 setSubjectAnswer(d,'classes','unsure');assert.deepEqual(d.answers.classes,{status:'unsure',choices:[]});
 setSubjectAnswer(d,'classes','skipped');assert.deepEqual(d.answers.classes,{status:'skipped',choices:[]});assert.equal(setSubjectAnswer(d,'unknown','code'),false);
 assert.deepEqual(cleanReflection({version:1,answers:{classes:{status:'selected',choices:['bad','code','code','physical','studio']},project:{status:'unsure',choices:['app']},extra:{status:'selected',choices:['code']}}}).answers,{classes:{status:'selected',choices:['code','physical']},project:{status:'unsure',choices:[]}});
 assert.deepEqual(cleanReflection({version:3,answers:d.answers}),freshReflection());
});
test('fewer than two substantive questions retains exact baseline order even with many unknowns',()=>{
 for(const mode of ['unsure','skipped']){const d=freshReflection();for(const q of subjectQuestions)setSubjectAnswer(d,q.id,mode);assert.deepEqual(order(orderReflectedPathways(baseline,d)),order(baseline));assert.equal(reflectionProgress(d).substantive,0);setSubjectAnswer(d,'classes','studio');assert.deepEqual(order(orderReflectedPathways(baseline,d)),order(baseline));}
});
test('two options in one question count once and ties preserve the original interest order',()=>{
 const d=freshReflection();setSubjectAnswer(d,'classes','code');setSubjectAnswer(d,'project','app');setSubjectAnswer(d,'classes','studio');
 const rows=orderReflectedPathways(baseline,d);assert.equal(rows.find(p=>p.id==='design').subjectConnections,2);assert.equal(rows.find(p=>p.id==='software').subjectConnections,2);
 assert.ok(rows.findIndex(p=>p.id==='software')<rows.findIndex(p=>p.id==='design'));
 for(const p of rows)assert.equal(p.score,baseline.find(b=>b.id===p.id).score);
});
test('contrasting subject choices change starting points without salary or occupation-count inputs',()=>{
 const digital=freshReflection(),creative=freshReflection();for(const [q,o]of [['classes','code'],['project','app'],['practice','debug'],['next','digital']])setSubjectAnswer(digital,q,o);
 for(const [q,o]of [['classes','studio'],['project','story'],['practice','studio'],['next','create']])setSubjectAnswer(creative,q,o);
 assert.equal(orderReflectedPathways(baseline,digital)[0].id,'software');assert.equal(orderReflectedPathways(baseline,creative)[0].id,'design');
 const altered=baseline.map(p=>({...p,occupations:Array(999).fill('invented'),salary:1e9,programs:[]}));assert.deepEqual(order(orderReflectedPathways(altered,creative)),order(orderReflectedPathways(baseline,creative)));
 const before=structuredClone(baseline);orderReflectedPathways(baseline,digital);assert.deepEqual(baseline,before);
 const noProfile=scorePathways(data.pathways,{complete:false});const rows=orderReflectedPathways(noProfile,creative);assert.equal(rows[0].subjectConnections,4);assert.ok(['design','media','arts','architecture'].includes(rows[0].id));assert.ok(rows.every(p=>p.score===null));const tied=rows.filter(p=>p.subjectConnections===4);assert.deepEqual(tied.map(p=>p.title),tied.map(p=>p.title).sort((a,b)=>a.localeCompare(b)));
});
test('sample subjects start blank, explicit fictional choices stay memory-only, and navigation includes optional stage',()=>{
 assert.deepEqual(student.reflection,freshReflection());const d=makeSampleDraft();d.reflection=jordanSubjectReflection();assert.equal(reflectionProgress(d.reflection).substantive,8);
 persistForMode({sample:true,storage:{setItem(){assert.fail('sample wrote real storage');}},key:'x',draft:d});assert.deepEqual(sampleInterest(d).raw,[29,36,23,17,16,27]);assert.deepEqual(d.saved,['software','electrical','design']);
 for(let i=0;i<journeySteps.length;i++)assert.equal(journeyStepFor(journeySteps[i].route),i);
});
test('rendered prompts distinguish original reflection, preserve uncertainty, escape content and reject bad routes',()=>{
 const d=jordanSubjectReflection(),rows=orderReflectedPathways(baseline,d),html=subjectPage(d,'summary',baseline),intro=subjectPage(freshReflection(),undefined,baseline,{sample:true});
 assert.match(intro,/not a validated assessment/);assert.match(intro,/data-subject-sample/);assert.match(html,/does not change your saved shortlist/);assert.match(html,/8 of 8/);
 assert.match(subjectPage(d,'0',baseline),/Not sure yet/);assert.match(subjectPage(d,'0',baseline),/aria-pressed="true"/);assert.match(subjectPage(d,'8',baseline),/isn’t available/);assert.match(subjectPage(d,'-1',baseline),/isn’t available/);assert.match(subjectPage(d,'NaN',baseline),/isn’t available/);
 assert.match(pathwayReason(rows.find(p=>p.id==='software')),/Programming and creative computing/);assert.ok(ids.every(id=>stretchFor({id}).length>40));assert.match(subjectMethod(data.pathways),/not calibrated/);
 const bad={...rows[0],subjectReasons:[{labels:['<script>']}]};assert.ok(!pathwayReason(bad).includes('<script>'));
});
test('subject suggestions are available without a complete profiler and without hiding areas',()=>{
 const html=discoveryPage({data,occupations:{},sources:{collegeRelevant:829},profile:{complete:false},areaFilter:'all',query:'',browseAll:false,reflection:jordanSubjectReflection(),card:p=>`<article data-path="${p.id}"></article>`,lifestyle:'',profileStrip:'',earningsIntro:''});
 assert.match(html,/Four starting points/);assert.equal((html.match(/data-path=/g)||[]).length,4);assert.equal((html.match(/class="area-card /g)||[]).length,6);
});
