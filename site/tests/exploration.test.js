import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,sanitizeState} from '../dist/model.js';
import {analyze} from '../dist/analysis.js';
import {careerCandidates,cleanExploration,freshExploration,followUpPrompts,privateExplorationForReport,selectedFollowUps} from '../dist/exploration.js';
import {careerReflectionPage,journeyPage} from '../dist/exploration-ui.js';
import {occupations} from '../dist/occupation-data.js';

const sampleId='psychiatric-aide';
test('v1 drafts without exploration migrate without losing any legacy answers',()=>{
 const legacy=freshState();delete legacy.exploration;legacy.profile.nickname='Sam';legacy.curiosity['curiosity-helping']=5;legacy.actions=[{id:'old',title:'Talk to a counselor',detail:'Ask about an elective.',done:true}];
 const restored=sanitizeState(legacy);assert.deepEqual(restored.exploration,freshExploration());assert.equal(restored.profile.nickname,'Sam');assert.deepEqual(restored.actions,legacy.actions);
});

test('exploration round trips the optional planning and career reflection fields',()=>{
 const s=freshState();s.exploration={journey:'full',savedCareers:[sampleId],compareCareers:[sampleId],careerChoices:{[sampleId]:'questions'},careerOrder:[sampleId],followUps:{[sampleId]:{'task-preference':{response:'I like explaining ideas.',status:'answered',exposure:'some',confidence:4,evidence:'Science fair',date:'2026-10-15'}}},careerNotes:{[sampleId]:'Ask about shift schedules.'},careerQuestions:{[sampleId]:'What training is supervised?'},context:{language:'Spanish',educationLocation:'Illinois',routes:['college','certificate'],costConcerns:'Tuition',supportNeeds:'A counselor',nomination:'Psychiatric Aide'},lastRoute:'career/psychiatric-aide'};
 assert.deepEqual(sanitizeState(s).exploration,s.exploration);
});

test('cleaning rejects unknown IDs, dangerous keys, invalid statuses and malformed fields',()=>{
 const result=cleanExploration({journey:'fast',savedCareers:['constructor',sampleId,'bogus'],compareCareers:['software','industrial-design','social-research','environmental-science'],careerChoices:{constructor:'explore',unknown:'explore',[sampleId]:'malicious'},careerOrder:['__proto__',sampleId],followUps:{[sampleId]:{'task-preference':{response:'<script>',status:'skip-all',exposure:'often',confidence:0,evidence:'',date:'2026-02-30'},bogus:{response:'Should vanish',status:'answered'}},constructor:{'task-preference':{response:'bad'}}},careerNotes:{[sampleId]:'<img onerror=x>',constructor:'pollute'},careerQuestions:{[sampleId]:'<script>alert(1)</script>'},context:{routes:['college','constructor','work'],nomination:'Psychiatric Aide'},lastRoute:'/admin'});
 assert.equal(result.journey,'');assert.deepEqual(result.savedCareers,[sampleId]);assert.equal(result.compareCareers.length,3);assert.deepEqual(result.careerChoices,{});assert.deepEqual(result.careerOrder,[sampleId]);assert.equal(result.followUps[sampleId]['task-preference'].status,'');assert.equal(result.followUps[sampleId]['task-preference'].date,'');assert.equal(result.followUps[sampleId].bogus,undefined);assert.equal(Object.hasOwn(result.followUps,'constructor'),false);assert.equal(Object.hasOwn(result.careerNotes,'constructor'),false);assert.deepEqual(result.careerNotes,{[sampleId]:'<img onerror=x>'});assert.equal(result.careerQuestions[sampleId],'<script>alert(1)</script>');assert.deepEqual(result.context.routes,['college','work']);assert.equal(result.lastRoute,'');
});

test('compare selection is bounded at three, preserves order and allows removal',()=>{
 const raw={...freshExploration(),compareCareers:['software','industrial-design','social-research','environmental-science','software']};
 assert.deepEqual(cleanExploration(raw).compareCareers,['software','industrial-design','social-research']);
 raw.compareCareers.splice(1,1);assert.deepEqual(cleanExploration(raw).compareCareers,['software','social-research','environmental-science']);
});

test('optional follow-ups use stable original prompt identifiers and limit each career to six',()=>{
 assert.equal(followUpPrompts.length,10);assert.equal(new Set(followUpPrompts.map(p=>p.id)).size,10);for(const career of occupations){const selected=selectedFollowUps(freshState(),career.id);assert.ok(selected.length<=6);assert.ok(selected.every(p=>p.careerId===career.id));assert.ok(selected.some(p=>p.id==='task-preference'));assert.ok(selected.some(p=>p.id==='setting-schedule'));assert.ok(selected.some(p=>p.id==='learning-route'));}
 assert.ok(selectedFollowUps(freshState(),sampleId).some(p=>p.id==='everyday-support'));
});

test('not-tried, skip, dislike and a numeric zero remain distinct persisted values',()=>{
 const s=freshState();s.curiosity['curiosity-1']=0;s.exploration.followUps[sampleId]={'task-preference':{response:'',status:'not-tried',exposure:'new',confidence:null,evidence:'',date:'2026-10-16'},'routine-accuracy':{response:'',status:'skipped',exposure:'',confidence:null,evidence:'',date:'2026-10-16'}};s.results.connections.design={experience:'disliked',notes:'Tried a club activity.',choice:''};
 const restored=sanitizeState(s);assert.equal(restored.curiosity['curiosity-1'],undefined);assert.equal(restored.exploration.followUps[sampleId]['task-preference'].status,'not-tried');assert.equal(restored.exploration.followUps[sampleId]['routine-accuracy'].status,'skipped');assert.equal(restored.results.connections.design.experience,'disliked');
});

test('reflection responses never alter standardized interest analysis',()=>{
 const s=freshState();const before=analyze(s);s.exploration.followUps[sampleId]={'use-evidence':{response:'I enjoy research.',status:'answered',date:'2026-10-16'}};s.exploration.careerChoices[sampleId]='later';const after=analyze(s);assert.deepEqual(after.status,before.status);assert.deepEqual(after.items.map(i=>[i.id,i.evidence,i.lane]),before.items.map(i=>[i.id,i.evidence,i.lane]));
});

test('candidate connections are source-aware and recalculate after score evidence changes',()=>{
 const s=freshState();Object.assign(s.results.interest,{form:'onet-60-paper',version:'paper',source:'official report',origin:'paper',date:'2026-10-16',representation:'raw',min:'0',max:'10',verified:true,suitable:true,scores:{R:'9',I:'2',A:'1',S:'3',E:'1',C:'1'}});
 const first=careerCandidates(s),editorial=first.find(c=>c.category==='editorial');assert.ok(editorial);assert.ok(editorial.evidence.length);assert.ok(editorial.evidence[0].id.startsWith('interest:'));assert.equal(editorial.career.id,editorial.id);
 const evidenceId=editorial.evidence[0].id;s.results.interest.scores={R:'1',I:'1',A:'1',S:'1',E:'1',C:'1'};const second=careerCandidates(s);assert.ok(!second.some(c=>c.evidence.some(e=>e.id===evidenceId)));
});

test('student-selected careers appear before editorial suggestions and without a fit claim',()=>{
 const s=freshState();s.exploration.savedCareers=[sampleId];s.exploration.careerChoices[sampleId]='explore';const candidates=careerCandidates(s);assert.equal(candidates[0].id,sampleId);assert.equal(candidates[0].category,'student-choice');assert.equal(candidates[0].selected,true);assert.equal(candidates[0].evidence[0].type,'choice');
});

test('exact student nomination stays first, set-aside careers stay out, and provider returns remain separate',()=>{
 const s=freshState();s.exploration.context.nomination='Psychiatric Aide';s.exploration.savedCareers=['software'];s.exploration.careerChoices['software']='later';s.results.providerReturns={ids:['market-research','teaching','unknown'],source:'Official provider report',date:'2026-10-15',verified:true};
 const rows=careerCandidates(s);assert.equal(rows[0].id,sampleId);assert.equal(rows[0].category,'student-choice');assert.ok(!rows.some(c=>c.id==='software'));const returned=rows.find(c=>c.id==='market-research');assert.equal(returned.category,'official-return');assert.deepEqual(returned.evidence[0],{id:'provider-return:market-research:2026-10-15',type:'official-return',label:'This occupation was returned by the assessment provider.',reference:'Official provider report · 2026-10-15'});
 s.exploration.savedCareers=['software','industrial-design','social-research','environmental-science','market-research'];assert.equal(careerCandidates(s)[0].id,sampleId);
 s.results.providerReturns.verified=false;assert.ok(!careerCandidates(s).some(c=>c.category==='official-return'));
});

test('private narrative is absent from reports by default and only returned on explicit opt-in',()=>{
 const s=freshState();s.exploration.careerNotes[sampleId]='Private note';s.exploration.context.supportNeeds='Private context';assert.equal(privateExplorationForReport(s),null);assert.equal(privateExplorationForReport(s,false),null);assert.equal(privateExplorationForReport(s,true).careerNotes[sampleId],'Private note');
});

test('journey and reflection UI keeps form routes and escapes entered narrative',()=>{
 const s=freshState();s.exploration.context.nomination='<img src=x onerror=alert(1)>';s.exploration.followUps[sampleId]={'task-preference':{response:'<svg onload=alert(1)>',status:'answered'}};
 const start=journeyPage(s),reflection=careerReflectionPage(sampleId,s);assert.match(start,/official 30-item online Mini-IP/i);assert.match(start,/data-exploration-route="college"/);assert.doesNotMatch(start,/<img src=x onerror=alert\(1\)>/);assert.match(start,/&lt;img src=x onerror=alert\(1\)&gt;/);assert.doesNotMatch(reflection,/<svg onload=alert\(1\)>/);assert.match(reflection,/&lt;svg onload=alert\(1\)&gt;/);assert.match(reflection,/data-follow-up-field="response"/);
});
