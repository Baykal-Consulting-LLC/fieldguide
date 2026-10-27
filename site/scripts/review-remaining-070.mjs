// Read-only audit of the frozen 0.69 research result. Does not create answers.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {gunzipSync,gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {currentModelStates} from './current-model-states.mjs';
import {cohort056Cases} from './cohort-056-source.mjs';
import {applyBroadFollowups052} from '../dist/broad-followups-052-replay.js';
import {applyExplorerReviews053} from '../dist/explorer-053-replay.js';
import {applyModelContext056,explorerResults,explorerCareerQuestions,explorerAnswer} from '../dist/open-explorer-056.js';
import {saveExplorerAnswer} from '../dist/explorer-053-state.js';
import {educationRoutesFor} from '../dist/education-routes.js';
import {bachelorGraduate} from '../analytics/performance/src/content/shared/system-match-metrics.js';
import {rules as oldRules,connect,structuredLedger} from '../prototypes/targeted-067/engine.mjs';
import {authoredEvidence} from '../research/targeted-067/review.mjs';
import {evidenceRules069,decide} from '../prototypes/evidence-069/rules.mjs';
import * as spec from '../calibration/cohort-056/spec.mjs';
import {topicChosen} from '../calibration/cohort-056/constructs.mjs';
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p));
const root='research/remaining-070/';fs.mkdirSync(root,{recursive:true});
const base=read('research/evidence-069/results.json.gz'),baseMap=new Map(base.rows.map(r=>[r.id,r]));
const frozenStates=new Map(read('research/evidence-069/freeze-001.json').plan.map(r=>[r.id,r.stateHash]));
const profiles=new Map(read('calibration/cohort-056/profiles.json').map(p=>[p.id,p]));
const bindings=read('calibration/cohort-056/question-bindings.json');
const ruleMap=new Map(evidenceRules069.map(r=>[r.questionId,r]));
const inputs=['scripts/review-remaining-070.mjs','research/evidence-069/freeze-001.json','research/evidence-069/results.json.gz','calibration/cohort-056/question-bindings.json','calibration/cohort-056/profiles.json','calibration/cohort-056/constructs.mjs','calibration/cohort-056/spec.mjs','prototypes/evidence-069/rules.mjs','prototypes/targeted-067/engine.mjs','research/targeted-067/review.mjs','dist/open-explorer.js','dist/open-explorer-056.js'];
const hashes=Object.fromEntries(inputs.map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')]));
const cases=[...currentModelStates().filter(({c})=>baseMap.has(c.id)).map(({c,state})=>({c,state:applyExplorerReviews053(applyBroadFollowups052(state,c.id),c.id)})),...cohort056Cases().map(c=>({c,state:c.experimentState}))].map(({c,state})=>({c,state:applyModelContext056(state,c)}));
const definitions={},rows=[];
function apply(s,id,q,d){const a=explorerAnswer(s,'profession',id,q);if(!a?.reviewHold&&!['yes','no'].includes(a?.response)&&d.response==='yes')saveExplorerAnswer(s,{kind:'profession',scope:id,questionId:q.id,payload:{response:'yes',source:'profile-inferred',confidence:'medium',evidence:'Research contextual evidence: '+d.evidence.map(x=>x.feature+': '+x.quote).join(' · ')},at:'2026-10-21T06:00:00.000Z'});}
const groups=xs=>!xs?.length?[]:Array.isArray(xs[0])?xs:[xs];
function requirements(q){const b=bindings.questions[q.id];if(!b)return null;const r=ruleMap.get(q.id);return r?{all:r.all,any:r.any,block:r.block,source:'0.69 alternative'}:{all:[...(b.topicAll||[]).map(k=>'t:'+k),...(b.methodAll||[]).map(k=>'m:'+k),...(b.responsibilityAll||[]).map(k=>'r:'+k),...(b.specificAll||[]).map(k=>'s:'+k)],any:[...groups(b.topicAny).map(g=>g.map(k=>'t:'+k)),...groups(b.methodAny).map(g=>g.map(k=>'m:'+k))],block:[],source:'Current binding'};}
for(const {c,state} of cases){
 const baseline=baseMap.get(c.id);if(baseline.afterTop.some(bachelorGraduate))continue;
 assert.equal(createHash('sha256').update(JSON.stringify(state)).digest('hex'),frozenStates.get(c.id),'Frozen source state drift '+c.id);
 const p=profiles.get(c.id),s=structuredClone(state),oldLedger=p?structuredLedger(p,spec):{yes:authoredEvidence[c.id]||{},no:{}};
 for(const id of Object.keys(oldRules))for(const q of explorerCareerQuestions(id).filter(q=>q.kind==='specific'))apply(s,id,q,connect(oldLedger,id,q.domain));
 for(const r of evidenceRules069){const q=explorerCareerQuestions(r.careerId).find(q=>q.id===r.questionId);apply(s,r.careerId,q,decide(baseline.ledger,r));}
 const auditLedger=structuredClone(baseline.ledger);
 // Preserve the production fixture's explicit quality alias; it is not a new interest.
 if(p&&topicChosen(p,'quality'))auditLedger.yes['t:quality']=[...(auditLedger.yes['m:testing']||[]),...['mechanics','electronics'].flatMap(k=>auditLedger.yes['t:'+k]||[])];
 const result=explorerResults(s),supported=result.rows.filter(r=>r.specific.supported);
 assert.deepEqual(supported.map(r=>r.id),baseline.afterSupported.map(r=>r.id),'Research replay drift '+c.id);
 const candidates=[],nonDegreeCandidates=[];
 for(const r of result.rows){
  const routes=educationRoutesFor(r.o),degree=routes.some(x=>['college','graduate'].includes(x.key));if(!degree&&baseline.afterTop.length)continue;
  const qs=explorerCareerQuestions(r.id).filter(q=>q.kind==='specific');
  const checks=qs.map(q=>{const b=bindings.questions[q.id],req=requirements(q),a=explorerAnswer(s,'profession',r.id,q),d=req?decide(auditLedger,req):null;
   const effective=oldRules[r.id]?connect(oldLedger,r.id,q.domain):d;
   definitions[q.id]??={id:q.id,careerId:r.id,title:r.o.title,prompt:q.prompt,domain:q.domain||q.id,binding:b||null,requirements:oldRules[r.id]?{all:oldRules[r.id][q.domain],source:'0.68 typed evidence rule'}:req};
   return{questionId:q.id,response:a?.response??null,source:a?.source??null,confidence:a?.confidence??null,hold:a?.reviewHold||null,evidence:a?.evidence||null,missing:effective?.missing||[],blocked:effective?.blocked||[],bindingSatisfied:effective?.response==='yes',used:effective?.evidence?.map(e=>({feature:e.feature,quote:e.quote,source:e.source,path:e.path,questionId:e.questionId,optionId:e.optionId}))||[],unbound:!req&&!oldRules[r.id]};});
  const cb=bindings.careers[r.id];const allTopics=[...new Set(qs.flatMap(q=>bindings.questions[q.id]?.topicAll||[]))];const topics=allTopics.length?allTopics:cb?.topicAll||[];
  const positiveTopics=topics.filter(k=>auditLedger.yes['t:'+k]?.length),negativeTopics=topics.filter(k=>auditLedger.no['t:'+k]?.length);
  const subjectQs=qs.filter(q=>q.domain==='domain'||!q.domain);const subjectComplete=subjectQs.some(q=>{const b=bindings.questions[q.id];return b&&((b.topicAll||[]).length+groups(b.topicAny).length)>0&&(b.topicAll||[]).every(k=>auditLedger.yes['t:'+k]?.length&&!auditLedger.no['t:'+k]?.length)&&groups(b.topicAny).every(g=>g.some(k=>auditLedger.yes['t:'+k]?.length&&!auditLedger.no['t:'+k]?.length));});
  // Subject anchors determine review priority only, never career support.
  const hasAnchor=r.specific.specificDomains.length||r.specific.taskDomainCount||positiveTopics.length;
  if(!hasAnchor&&!r.specific.supported)continue;
  const taskQuestions=explorerCareerQuestions(r.id).filter(q=>q.kind!=='specific').map(q=>({id:q.id,prompt:q.prompt,options:q.options?.filter(o=>o.careerIds?.includes(r.id)).map(o=>({id:o.id,text:o.text})),answer:explorerAnswer(s,'profession',r.id,q)||explorerAnswer(s,'field',q.field,q)}));
  (degree?candidates:nonDegreeCandidates).push({id:r.id,title:r.o.title,supported:r.specific.supported,routes:routes.map(x=>x.key),r:r.r,fields:r.fields,activityTopics:r.activityTopics,specificDomains:r.specific.specificDomains,taskDomains:r.specific.taskDomains,positiveTopics,negativeTopics,subjectComplete,checks,taskQuestions,taskEvidence:r.specific.evidence.filter(e=>e.kind==='task'),requirement:r.specific.requirement,source:r.o.source||r.o.sources?.[0]||null});
 }
 rows.push({id:c.id,name:baseline.name,cohort:baseline.cohort,source:baseline.source,noTop:!baseline.afterTop.length,top:baseline.afterTop,degreeOutsideTop:baseline.afterSupported.filter(bachelorGraduate),ledger:auditLedger,candidates,nonDegreeCandidates,biography:p?null:c.biography||null});
 if(rows.length%50===0)console.log('Reviewed '+rows.length+' models');
}
assert.equal(rows.length,317);assert.equal(rows.filter(r=>r.noTop).length,188);
const cohorts=Object.fromEntries(['all','development','holdout','holdout049','holdout056'].map(k=>{const rs=rows.filter(r=>k==='all'||r.cohort===k);return[k,{noDegreeTop:rs.length,noTop:rs.filter(r=>r.noTop).length,degreeBelowCap:rs.filter(r=>r.degreeOutsideTop.length).length,authored:rs.filter(r=>r.source==='Authored saved choices').length,structured:rs.filter(r=>r.source==='Structured profile').length}];}));
for(const[p,h]of Object.entries(hashes))assert.equal(createHash('sha256').update(fs.readFileSync(p)).digest('hex'),h);
const out={schemaVersion:1,baseline:base.experiment,baselineRunId:base.baselineRunId,hashes,cohorts,definitions,rows,limits:['Read-only diagnostic audit. No answers, source profiles, thresholds, live matching or frozen results were changed.','Candidate review anchors are not match decisions. Broad interests, partial evidence and unbound questions do not establish supported Top.','All previously inspected holdouts remain separate diagnostic groups, not untouched validation.']};
fs.writeFileSync(root+'audit.json.gz',gzipSync(JSON.stringify(out),{level:9}));fs.writeFileSync(root+'summary.json',JSON.stringify({cohorts,models:rows.length,candidatePairs:rows.reduce((n,r)=>n+r.candidates.length,0),definitions:Object.keys(definitions).length},null,2));console.log(JSON.stringify({cohorts,models:rows.length,candidatePairs:rows.reduce((n,r)=>n+r.candidates.length,0)},null,2));
