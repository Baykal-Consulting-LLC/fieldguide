import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {gunzipSync,gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {fileURLToPath} from 'node:url';
import {freshState} from '../../site/dist/model.js';
import {saveExplorerAnswer} from '../../site/dist/explorer-053-state.js';
import {explorerResults} from '../../site/dist/open-explorer-090.js';
import {selectAutomaticFollowups083} from '../../site/dist/automatic-followups-083.js';
import {initialLead094} from '../../site/prototypes/evidence-094/targeting.mjs';
import {questions100} from '../../site/prototypes/evidence-100/questions.mjs';
import {choose100} from '../../site/prototypes/evidence-100/targeting.mjs';
import {answer103} from '../../site/prototypes/evidence-103/answer.mjs';
import {legacyProfiles098} from '../../site/prototypes/evidence-098/profiles.mjs';
import {refresh095} from '../../site/prototypes/evidence-095/fast-rows.mjs';
import {key095} from '../../site/prototypes/evidence-095/targeting.mjs';
import {educationRoutesFor} from '../../site/dist/education-routes.js';
import {createProtectedSelector} from './selector.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const protocol=JSON.parse(fs.readFileSync(path.join(dir,'protocol.json')));
function verifySources(){for(const source of protocol.sources)assert.equal(createHash('sha256').update(fs.readFileSync(path.resolve(dir,'../..',source.path))).digest('hex'),source.sha256,source.path+' changed');}
verifySources();
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p));
const matrix=read('dist/developer/matrix-104.json.gz'),journeys=read('dist/developer/journeys-104.json.gz');
const profiles=new Map([...read('calibration/cohort-056/profiles.json'),...read('calibration/grok-075/profiles.json'),...legacyProfiles098].map(p=>[p.id,p]));
const journeyMap=new Map(journeys.rows.map(j=>[j.id,j])),degree=r=>educationRoutesFor(r.o).some(x=>['college','graduate'].includes(x.key));
const neutral={positiveTopics:[],negativeTopics:[],positiveMethods:[],negativeMethods:[],responsibilities:[],specialtyPreferences060:{}},capability=new Map();
function canAnswer(q,id){if(!q)return false;const key=id+'|'+q.id;if(!capability.has(key)){const a=answer103(neutral,q,id);capability.set(key,a.optionAudits?.length?a.optionAudits.some(o=>!o.bindingMissing):!a.bindingMissing);}return capability.get(key);}
const budgets=[0,4,8,12,16,24];
function run(record,mode){
 const j=journeyMap.get(record.id),s=freshState(),protectedSelector=createProtectedSelector();s.profile.nickname=record.name;s.finance=structuredClone(j.finance);s.guide.lifestyleBuilder=structuredClone(j.lifestyleBuilder);s.profileJourney={officialInterest:structuredClone(j.officialInterest)};
 assert.equal(Object.keys(s.explorer053?.fieldAnswers||{}).length,0);assert.equal(Object.keys(s.explorer053?.professionAnswers||{}).length,0);assert.equal(Object.keys(s.profileJourney.officialInterest.answers).length,60);
 const seeds=explorerResults(s).rows,seen=new Set(),observed=new Map(),answers=[],curve=[];
 let current=seeds,lead=initialLead094(selectAutomaticFollowups083(s));
 const get=(id,q)=>observed.get(key095({id},q))||null;
 function snapshot(budget){const actual=explorerResults(s).rows;assert.deepEqual(current.map(r=>[r.id,r.specific.supported,r.specific.taskDomains,r.specific.specificDomains,r.specific.contrary.map(q=>q.questionId)]),actual.map(r=>[r.id,r.specific.supported,r.specific.taskDomains,r.specific.specificDomains,r.specific.contrary.map(q=>q.questionId)]));current=actual;const strong=actual.filter(r=>r.specific.supported),top=strong.slice(0,3);curve.push({budget,asked:answers.length,unknown:answers.filter(a=>a.unknown).length,top:top.map(r=>r.id),degreeTop:top.filter(degree).map(r=>r.id),strong:strong.map(r=>r.id),degreeAny:strong.filter(degree).map(r=>r.id)});}
 snapshot(0);
 while(answers.length<24){
  let item;
  while(lead.length&&!item){const next=lead.shift(),r=current.find(r=>r.id===next.careerId),q=r&&questions100(r.id).find(q=>q.id===next.questionId);if(r&&canAnswer(q,r.id)&&!seen.has(key095(r,q)))item={r,q,key:key095(r,q),reasonA3:'same-initial-lead'};}
  item??=(mode==='baseline'?choose100:protectedSelector.choose)(current,{questionsFor:questions100,answerFor:get,seen,canAnswer,events:answers,remaining:24-answers.length});
  if(!item)break;
  const {r,q,key}=item;assert.ok(!seen.has(key));seen.add(key);
  // A profile is consulted only after the selector commits to a question.
  const a=answer103(profiles.get(record.id),q,r.id);observed.set(key,a);
  if(a.response==='unfamiliar'||a.response==='no')lead=[];
  const field=q.options&&!['specific','core-work'].includes(q.kind);
  saveExplorerAnswer(s,{kind:field?'field':'profession',scope:field?q.field:r.id,questionId:q.id,payload:a,at:'2026-10-24T00:00:00.000Z'});
  answers.push({careerId:r.id,id:q.id,key,field:field?q.field:null,response:a.response,selected:a.selected||[],unknown:a.response==='unfamiliar',bindingMissing:!!a.bindingMissing,unknownReason:a.unknownReason||null,evidenceRefs:a.evidenceRefs||[],reason:item.reasonA3||'current-control',bundle:item.bundle??null});
  current=refresh095(s,seeds);if(budgets.includes(answers.length))snapshot(answers.length);
 }
 if(!curve.some(c=>c.budget===24))snapshot(24);
 protectedSelector.finish(current);
 const strong=current.filter(r=>r.specific.supported),candidates=current.filter(r=>!r.specific.supported&&(r.r>=.608||r.specific.evidence.length||r.activityTopics?.length));
 const priority=candidates.filter(r=>r.specific.evidence.length&&r.r>=.608&&!r.specific.contrary.length);
 const compact=r=>({id:r.id,title:r.o.title,degree:degree(r),r:r.r,evidence:r.specific.evidence.length,contexts:r.specific.taskDomains.length,interests:r.specific.specificDomains.length,contrary:r.specific.contrary.length,missing:r.specific.missing.map(q=>q.id),fields:r.fields,evidenceIds:r.specific.evidence.map(e=>e.questionId)});
 if(mode==='baseline'){assert.deepEqual(strong.map(r=>r.id),record.arms.previous.offers.filter(x=>x[2]>0).map(x=>x[0]),record.id+' baseline supported parity');assert.deepEqual(answers.map(a=>[a.careerId,a.id]),j.arms.previous.map(a=>a.slice(0,2)),record.id+' baseline question parity');}
 return {curve,answers,episodes:mode==='baseline'?[]:protectedSelector.episodes,strong:strong.map(compact),priority:priority.map(compact),candidates:candidates.map(compact),display:{strong:strong.length,priority:priority.length,allCandidates:candidates.length,broadOnly:candidates.filter(r=>!r.specific.evidence.length).length,displayedCollege:strong.filter(degree).length,hiddenConfirmedCollege:0},unbound:answers.filter(a=>a.bindingMissing).length};
}
const shard=Number(process.env.A3_SHARD||0),count=Number(process.env.A3_SHARDS||1),limit=Number(process.env.A3_LIMIT||0);
let records=matrix.rows.filter((r,i)=>i%count===shard);if(limit)records=records.slice(0,limit);
const start=performance.now(),rows=[];
for(const record of records){const j=journeyMap.get(record.id),hash=createHash('sha256').update(JSON.stringify(j)).digest('hex');const baseline=run(record,'baseline'),targeted=run(record,'targeted');assert.equal(createHash('sha256').update(JSON.stringify(j)).digest('hex'),hash);rows.push({id:record.id,name:record.name,cohort:record.cohort,baseline,targeted});if(rows.length%25===0)console.log(JSON.stringify({shard,models:rows.length,total:records.length,seconds:Math.round((performance.now()-start)/1000)}));}
verifySources();
const out={protocol:'A3-protected-confirmations-v1',shard,generatedAt:new Date().toISOString(),elapsedSeconds:(performance.now()-start)/1000,rows};
fs.writeFileSync(path.join(dir,limit?'pilot-'+shard+'.json.gz':'shard-'+shard+'.json.gz'),gzipSync(JSON.stringify(out),{level:9}));
console.log(JSON.stringify({done:true,shard,models:rows.length,elapsedSeconds:out.elapsedSeconds}));
