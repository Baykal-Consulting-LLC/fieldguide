import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STORAGE_KEY,freshDraft,scorePathways} from '../dist/engine.js';
import {makeSampleDraft,sampleInterest,draftForMode,persistForMode,journeySteps,journeyBanner,journeyOverview,journeyInterests} from '../dist/sample-journey.js';
import {lifestyleSnapshot,updateBudget,confirmLifestyle} from '../dist/lifestyle-state.js';
import {summarizeEarnings} from '../dist/earnings.js';
const data=JSON.parse(fs.readFileSync('dist/data/pathways.json')),earnings=JSON.parse(fs.readFileSync('dist/data/pathway-earnings.json'));
test('sample is complete, reproducible, calculated from all official responses and fresh on each replay',()=>{
 const a=makeSampleDraft(),b=makeSampleDraft(),p=sampleInterest(a),g=lifestyleSnapshot(a.lifestyle);
 assert.deepEqual(a,b);assert.notEqual(a,b);assert.equal(Object.keys(a.answers).length,60);assert.equal(Object.keys(a.lifestyle.builder.choices).length,9);assert.equal(p.complete,true);assert.deepEqual(p.raw,[29,36,23,17,16,27]);assert.equal(a.sample,null);assert.equal(g.confirmed,true);assert.equal(g.range.low,80000);assert.equal(g.range.high,100000);assert.ok(Math.abs(g.total-4784.738024719949)<1e-7);
 a.answers['onet-sf-01']=1;assert.notDeepEqual(a,b);assert.deepEqual(makeSampleDraft(),b);
});
test('fictional replay cannot read or overwrite a real draft, including when storage is unavailable',()=>{
 const storage={getItem(){throw Error('Do not read real records');},setItem(){throw Error('Do not write real records');}};
 const s=draftForMode({sample:true,storage,ids:data.pathways.map(p=>p.id)});s.notes.software='Fictional change';persistForMode({sample:true,storage,key:STORAGE_KEY,draft:s});assert.equal(s.saved.length,3);
 const values=new Map([[STORAGE_KEY,JSON.stringify({...freshDraft(),saved:['biology'],notes:{biology:'Private draft sentinel'}})]]),normal={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};const before=values.get(STORAGE_KEY);
 const demo=draftForMode({sample:true,storage:normal,ids:data.pathways.map(p=>p.id)});demo.saved=[];persistForMode({sample:true,storage:normal,key:STORAGE_KEY,draft:demo});assert.equal(values.get(STORAGE_KEY),before);
 const restored=draftForMode({sample:false,storage:normal,ids:data.pathways.map(p=>p.id)});assert.deepEqual(restored.saved,['biology']);assert.equal(restored.notes.biology,'Private draft sentinel');restored.notes.biology='Normal edit';persistForMode({sample:false,storage:normal,key:STORAGE_KEY,draft:restored});assert.equal(JSON.parse(values.get(STORAGE_KEY)).notes.biology,'Normal edit');
});
test('sample suggestions come from interests while the creative shortlist remains an explicitly editorial choice',()=>{
 const d=makeSampleDraft(),ranked=scorePathways(data.pathways,sampleInterest(d));assert.deepEqual(ranked.slice(0,4).map(p=>p.id),['physical','electrical','software','mechanical']);assert.deepEqual(d.saved,['software','electrical','design']);assert.equal(ranked.some(p=>p.id==='design'),true);const before=ranked.map(p=>p.id);updateBudget(d.lifestyle,'rent','2500');assert.deepEqual(scorePathways(data.pathways,sampleInterest(d)).map(p=>p.id),before);
 const html=journeyOverview(d,data,earnings);assert.match(html,/not the profiler’s top three/);assert.match(html,/Review the edited budget/);
});
test('the same budget yields distinct financial tradeoffs without choosing a profession',()=>{
 const d=makeSampleDraft(),counts=d.saved.map(id=>{const s=summarizeEarnings(earnings.pathways[id],d.lifestyle);return[s.entry.covers,s.entry.breathingRoom,s.median.covers];});assert.deepEqual(counts,[[1,0,3],[3,2,3],[0,0,2]]);assert.ok(!('primaryCareer'in d));assert.ok(d.saved.every(id=>d.notes[id]));assert.equal(Object.keys(d.tasks).length,0);
 updateBudget(d.lifestyle,'rent','2500');assert.equal(lifestyleSnapshot(d.lifestyle).confirmed,false);assert.equal(summarizeEarnings(earnings.pathways.software,d.lifestyle).entry.covers,0);confirmLifestyle(d.lifestyle);assert.ok(lifestyleSnapshot(d.lifestyle).range.low>80000);
});
test('all journey stages, all 60 original questions, provenance and exit controls are reviewable',()=>{
 const d=makeSampleDraft(),html=journeyInterests(d),guide=journeyBanner('compare');assert.equal(journeySteps.length,8);assert.equal((html.match(/aria-label="Review question /g)||[]).length,60);assert.match(html,/O\*NET/);assert.match(html,/not fit percentages/);assert.match(guide,/Fictional sample/);assert.match(guide,/Your own saved draft is untouched/);assert.match(guide,/Exit sample/);assert.match(guide,/aria-current="step"/);
 const app=fs.readFileSync('dist/app.js','utf8');assert.match(app,/fictionalSample:true/);assert.match(app,/fieldguide-jordan-fictional-sample/);assert.match(app,/isSampleJourney\)\{s=makeSampleDraft\(\)/);
});
