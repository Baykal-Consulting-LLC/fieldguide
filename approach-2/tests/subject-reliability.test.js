import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshReflection,setSubjectAnswer,subjectQuestions,subjectEvidence,subjectReviewQueue,orderReflectedPathways,cleanReflection} from '../dist/subject-reflection.js';
import {sparseSubjectClues,subjectPage,pathwayReason} from '../dist/subject-reflection-ui.js';
import {scorePathways,cleanDraft} from '../dist/engine.js';
import {makeSampleDraft,persistForMode} from '../dist/sample-journey.js';
import {discoveryPage} from '../dist/discovery-ui.js';
const data=JSON.parse(fs.readFileSync('dist/data/pathways.json')),ids=data.pathways.map(p=>p.id),base=scorePathways(data.pathways,{complete:true,raw:[16,34,22,30,26,24],flat:false,nearFlat:false});
const draft=c=>{const d=freshReflection();for(const[q,v]of Object.entries(c))for(const o of [].concat(v))assert.equal(setSubjectAnswer(d,q,o),true);return d;};
test('one policy answer keeps every policy clue separate from unchanged broad-interest starting points',()=>{
 const d=draft({classes:'civics'}),before=structuredClone(d),e=subjectEvidence(base,d);
 assert.equal(e.basis,'broad-interests');assert.deepEqual(e.clues.map(p=>p.id).sort(),['legal','public-service','society']);assert.deepEqual(e.clues.map(p=>p.title),e.clues.map(p=>p.title).sort((a,b)=>a.localeCompare(b)));
 assert.deepEqual(orderReflectedPathways(base,d).map(p=>p.id),base.map(p=>p.id));assert.deepEqual(d,before);
 const html=discoveryPage({data,occupations:{},sources:{collegeRelevant:829},profile:{complete:true,raw:[16,34,22,30,26,24]},areaFilter:'all',query:'',browseAll:false,reflection:d,card:p=>`<article data-ranked="${p.id}"></article>`,lifestyle:'',profileStrip:'',earningsIntro:''});
 assert.equal((html.match(/data-subject-clue=/g)||[]).length,3);assert.equal((html.match(/data-ranked=/g)||[]).length,4);assert.match(html,/Basis: broad interests only/);assert.match(html,/unranked clues/);assert.match(pathwayReason(e.clues[0]),/not a subject-ranked recommendation/);
});
test('all single current options preserve their entire clue set; legacy and general options add none',()=>{
 for(const q of subjectQuestions)for(const o of [...q.options,...q.legacyOptions]){const d=draft({[q.id]:o.id}),e=subjectEvidence(base,d);assert.deepEqual(e.clues.map(p=>p.id).sort(),q.options.includes(o)?o.paths.slice().sort():[],q.id+':'+o.id);assert.equal(e.basis,'broad-interests');}
});
test('optional follow-up is relevant, unanswered and never fills or overwrites an unknown answer',()=>{
 const d=draft({classes:'civics',project:'unsure',practice:'skipped'}),before=structuredClone(d),e=subjectEvidence(base,d),q=subjectQuestions[e.followUp.index];
 assert.equal(d.answers[q.id],undefined);assert.ok(q.options.some(o=>o.paths.some(id=>e.clues.some(p=>p.id===id))));assert.deepEqual(d,before);
 assert.match(subjectPage(d,String(e.followUp.index),base),/No answer yet/);assert.deepEqual(d,before);
 for(const q of subjectQuestions)if(!d.answers[q.id])setSubjectAnswer(d,q.id,'unsure');assert.equal(subjectEvidence(base,d).followUp,null);assert.deepEqual(d.answers.practice,{status:'skipped',choices:[]});
});
test('empty, unknown, paused and active reflections never masquerade as one-answer clues',()=>{
 for(const d of [freshReflection(),draft({classes:'unsure'}),draft({quantitative:'evidence'}),draft({classes:'civics',practice:'policy-case'}),{...draft({classes:'civics'}),useForSuggestions:false}]){assert.equal(subjectEvidence(base,d).clues.length,0);assert.equal(sparseSubjectClues(base,d),'');}
 const noProfile=scorePathways(data.pathways,{complete:false}),d=draft({classes:'civics'});assert.equal(subjectEvidence(noProfile,d).clues.length,3);assert.equal(subjectEvidence(noProfile,d).basis,'broad-interests');
});
test('guided review queues only actual older selected choices; deferral is read-only',()=>{
 const d=draft({classes:['organizations','code'],practice:'case',reading:'unsure',next:'skipped'}),before=structuredClone(d);
 assert.deepEqual(subjectReviewQueue(d).map(q=>q.id),['classes','practice']);const html=subjectPage(d,'review',base);assert.match(html,/2 earlier answers still to review/);assert.match(html,/Keep exploring; review later/);assert.ok(!html.includes('review-reading'));assert.deepEqual(d,before);
 const page=subjectPage(d,'review-classes',base);assert.match(page,/Business, economics and public life/);assert.match(page,/Keep earlier answer &amp; continue|Keep earlier answer & continue/);assert.match(page,/#\/subjects\/review-practice/);assert.deepEqual(d,before);
 assert.match(subjectPage(d,'review-bogus',base),/isn’t available/);
});
test('explicit replacement or unsure resolves only its reviewed question and preserves the rest of the full draft',()=>{
 const state=makeSampleDraft();state.reflection=draft({classes:['organizations','code'],practice:'case',project:'unsure',next:'skipped'});const before=structuredClone(state);
 assert.equal(setSubjectAnswer(state.reflection,'classes','civics'),false);assert.equal(setSubjectAnswer(state.reflection,'classes','organizations'),true);assert.equal(setSubjectAnswer(state.reflection,'classes','civics'),true);
 assert.deepEqual(state.reflection.answers.classes.choices,['code','civics']);assert.deepEqual(subjectReviewQueue(state.reflection).map(q=>q.id),['practice']);assert.match(subjectPage(state.reflection,'review-classes',base),/This question no longer contains an earlier broad choice/);
 setSubjectAnswer(state.reflection,'practice','unsure');assert.equal(subjectReviewQueue(state.reflection).length,0);assert.equal(state.reflection.answers.practice.status,'unsure');
 const restored=cleanDraft(JSON.parse(JSON.stringify(state)),ids);for(const key of ['answers','sample','saved','notes','tasks','lifestyle'])assert.deepEqual(restored[key],before[key]);for(const q of ['project','next'])assert.deepEqual(restored.reflection.answers[q],before.reflection.answers[q]);
 assert.deepEqual(cleanReflection(restored.reflection),restored.reflection);persistForMode({sample:true,storage:{setItem(){assert.fail('sample wrote real draft');}},draft:restored});assert.match(subjectPage(restored.reflection,'review',base),/No earlier broad choices need review/);
});
