import {directions} from '../dist/content.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,sanitizeState} from '../dist/model.js';
import {themes,interestStatus,analyze,fictionalState,abilityStatus} from '../dist/analysis.js';
import {visualReport,reportExport,updateResult} from '../dist/results-ui.js';

const ready=()=>fictionalState(freshState());
test('complete, verified profile preserves ties and routes only through declared editorial themes',()=>{
 const s=ready(),a=analyze(s);assert.equal(a.status.kind,'ready');assert.deepEqual(a.status.top,['I','A']);
 assert.ok(a.items.find(x=>x.id==='design').evidence.some(e=>e.source==='interest'));
 assert.equal(a.items.find(x=>x.id==='business').interestLinked,false);
 assert.equal(a.agenda[0].id,'design');assert.equal(a.items.length,directions.length);
});
test('blank scores are unknown; legitimate zero scores survive storage and analysis',()=>{
 const s=ready();s.results.interest.scores.C='';assert.equal(analyze(s).status.kind,'incomplete');assert.ok(analyze(s).items.every(x=>!x.interestLinked));
 s.results.interest.scores.C='0';assert.equal(sanitizeState(s).results.interest.scores.C,'0');assert.equal(analyze(s).status.kind,'ready');
});
test('flat and near-flat profiles produce no interest routing',()=>{
 const s=ready();for(const t of themes)s.results.interest.scores[t.id]='5';assert.equal(analyze(s).status.kind,'flat');assert.ok(analyze(s).items.every(x=>!x.interestLinked));
 s.results.interest.form='onet-60-online';s.results.interest.min='0';s.results.interest.max='40';s.results.interest.scores.I='6';assert.equal(analyze(s).status.kind,'broad');assert.deepEqual(analyze(s).status.top,[]);
});
test('unknown form, missing source, invalid scale and unsuitable or unchecked results stay recorded only',()=>{
 const mutations=[i=>i.form='provider-onet',i=>i.source='',i=>i.min='',i=>i.max='0',i=>i.suitable=false,i=>i.verified=false,i=>i.scores.R='11',i=>i.date='2026-02-31'];
 for(const change of mutations){const s=ready();change(s.results.interest);assert.notEqual(analyze(s).status.kind,'ready');assert.ok(analyze(s).items.every(x=>!x.interestLinked));}
});
test('paper and online scales do not silently convert and edits require a new source check',()=>{
 const s=ready();s.results.interest.scores.I='8.5';assert.equal(analyze(s).status.kind,'review');
 updateResult(s,{dataset:{result:'interest.form'},type:'select-one',value:'onet-30-online'});
 assert.equal(s.results.interest.max,'');assert.ok(Object.values(s.results.interest.scores).every(v=>v===''));assert.equal(s.results.interest.verified,false);assert.equal(s.results.interest.suitable,false);
});
test('missing or low ability and low confidence cannot exclude a direction',()=>{
 const s=ready();const before=analyze(s).items.map(x=>x.id);s.results.abilities=[];assert.deepEqual(analyze(s).items.map(x=>x.id),before);
 s.results.abilities=[{...ready().results.abilities[0],value:'1',scale:'percentile',norms:'Provider student population'}];s.confidence.making={exposure:'new',confidence:1};
 assert.deepEqual(analyze(s).items.map(x=>x.id),before);assert.equal(analyze(s).items.length,directions.length);
});
test('percentiles without reference groups and invalid percentile values are flagged',()=>{
 const a=ready().results.abilities[0];a.scale='percentile';a.value='50';a.norms='';assert.match(abilityStatus(a),/Comparison group/);
 a.norms='Source comparison sample';a.value='101';assert.match(abilityStatus(a),/Check percentile/);
});
test('shared battery IDs do not add confirming votes or alter direction ordering',()=>{
 const s=ready(),before=analyze(s).items.map(x=>x.id);s.results.abilities.push({...s.results.abilities[0],dimension:'Second dimension'});
 assert.equal(analyze(s).duplicates.length,1);assert.deepEqual(analyze(s).items.map(x=>x.id),before);
});
test('student choice, nomination, preparation and set-aside state remain explicit',()=>{
 const s=freshState();s.results.nomination='Music';s.results.connections.business={choice:'explore',experience:'new',notes:'',preparation:'Check economics coursework'};
 let a=analyze(s);assert.equal(a.nomination,'Music');assert.equal(a.agenda[0].id,'business');assert.equal(a.agenda[0].lane,'Explore with a learning plan');
 s.results.connections.business.choice='later';a=analyze(s);assert.ok(!a.agenda.some(x=>x.id==='business'));assert.ok(a.remaining.some(x=>x.id==='business'));assert.equal(a.items.length,directions.length);
});
test('source corrections withdraw dependent interest reasons and student reordering persists',()=>{
 const s=ready();s.results.order=['business'];assert.equal(analyze(s).agenda[0].id,'business');s.results.interest.verified=false;
 assert.ok(analyze(s).items.every(x=>!x.evidence.some(e=>e.source==='interest')));assert.ok(analyze(s).items.find(x=>x.id==='design').evidence.some(e=>e.source==='experience'));
});
test('analysis is deterministic and reports never emit fit probabilities',()=>{
 const s=ready();assert.deepEqual(analyze(s),analyze(s));const html=visualReport(s);assert.doesNotMatch(html,/\d+% (match|fit|chance)/);assert.match(html,/editorial/);assert.match(html,/Clinical practice can require graduate study/);
});
test('fictional report is isolated from real drafts and carries explicit labeling',()=>{
 const s=ready();s.profile.nickname='Personal name';const before=JSON.stringify(s);const html=visualReport(s,true);assert.equal(JSON.stringify(s),before);assert.match(html,/Fictional example/);assert.doesNotMatch(html,/Personal name/);assert.match(html,/disabled/);
});
test('new fields migrate safely from stage 2 and reject malformed or unknown direction records',()=>{
 const old={version:1,profile:{nickname:'My name'},savedDirections:['design']};const s=sanitizeState(old);assert.equal(s.profile.nickname,'My name');assert.equal(s.results.interest.scores.R,'');
 s.results.connections.unknown={choice:'explore'};s.results.order=['unknown','design','design'];s.results.abilities=[null,{dimension:'Test',verified:'true'}];const clean=sanitizeState(s);assert.equal(clean.results.connections.unknown,undefined);assert.deepEqual(clean.results.order,['design']);assert.equal(clean.results.abilities.length,1);assert.equal(clean.results.abilities[0].verified,false);
});
test('personal notes are opt-in in the visual report and report export',()=>{
 const s=ready();s.results.connections.design.notes='PRIVATE EXPERIENCE';s.results.connections.design.preparation='PRIVATE PREPARATION';s.results.valuesNotes='PRIVATE VALUES';s.results.nominationReason='PRIVATE REASON';s.results.includeNotes=false;
 assert.doesNotMatch(visualReport(s),/PRIVATE/);assert.doesNotMatch(JSON.stringify(reportExport(s)),/PRIVATE/);
 s.results.includeNotes=true;assert.match(visualReport(s),/PRIVATE EXPERIENCE/);assert.match(JSON.stringify(reportExport(s)),/PRIVATE VALUES/);
});
test('user-entered notes and subject nominations render as text rather than markup',()=>{
 const s=ready();s.results.nomination='<img src=x onerror=alert(1)>';s.results.connections.design.notes='<script>test()</script>';const html=visualReport(s);assert.doesNotMatch(html,/<img src=x|<script>test/);assert.match(html,/&lt;img/);
});
