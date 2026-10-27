import fs from 'node:fs';
import {authoredContexts071} from '../prototypes/evidence-071/authored-contexts.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync,gzipSync} from 'node:zlib';
import {currentModelStates} from './current-model-states.mjs';
import {cohort056Cases} from './cohort-056-source.mjs';
import {applyBroadFollowups052} from '../dist/broad-followups-052-replay.js';
import {applyExplorerReviews053} from '../dist/explorer-053-replay.js';
import {applyModelContext056,explorerResults,explorerCareerQuestions,explorerAnswer} from '../dist/open-explorer-056.js';
import {saveExplorerAnswer} from '../dist/explorer-053-state.js';
import {educationRoutesFor} from '../dist/education-routes.js';
import {explorerBudget} from '../dist/explorer-053-budget.js';
import {systemCohort,bachelorGraduate} from '../analytics/performance/src/content/shared/system-match-metrics.js';
import * as spec from '../calibration/cohort-056/spec.mjs';
import {rules as oldRules,connect,structuredLedger} from '../prototypes/targeted-067/engine.mjs';
import {authoredEvidence} from '../research/targeted-067/review.mjs';
import {evidenceRules069,decide} from '../prototypes/evidence-069/rules.mjs';
import {ledger071,mappingRules071,activityBank071,followupBank071,specialtyGuards071,selectFollowups071,simulate071,researchRows071,supportedOrder071} from '../prototypes/evidence-071/engine.mjs';

const root='research/evidence-071/';fs.mkdirSync(root,{recursive:true});
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p)),sha=x=>createHash('sha256').update(x).digest('hex');
const manifest=read('dist/developer/current-cohort-data.json'),previous=read('research/evidence-069/results.json.gz'),previousById=new Map(previous.rows.map(r=>[r.id,r]));
assert.equal(previous.baselineRunId,manifest.runId);
const base=new Map(manifest.parts.flatMap(p=>read('dist/developer/'+p.url).rows).filter(r=>r.phase!=='diagnostic049').map(r=>[r.id,r]));
const frozen069=read('research/evidence-069/freeze-001.json'),oldPlan=new Map(frozen069.plan.map(r=>[r.id,r]));
const profiles=new Map(read('calibration/cohort-056/profiles.json').map(p=>[p.id,p])),bindings=read('calibration/cohort-056/question-bindings.json');
const cases=[...currentModelStates().filter(({c})=>base.has(c.id)).map(({c,state})=>({c,state:applyExplorerReviews053(applyBroadFollowups052(state,c.id),c.id)})),...cohort056Cases().map(c=>({c,state:c.experimentState}))].map(({c,state})=>({c,state:applyModelContext056(state,c)}));
assert.equal(cases.length,1000);assert.equal(new Set(cases.map(x=>x.c.id)).size,1000);
const definitions={};
for(const r of mappingRules071){const q=explorerCareerQuestions(r.careerId).find(q=>q.id===r.questionId);assert.ok(q,'Invalid defining question '+r.questionId);definitions[q.id]={...q,careerId:r.careerId,binding:bindings.questions[q.id]};}
for(const q of followupBank071){assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);for(const id of q.careerIds)assert.ok(explorerCareerQuestions(id).length,'Invalid activity career '+id);}
const files=['scripts/benchmark-evidence-071.mjs','prototypes/evidence-071/engine.mjs','prototypes/evidence-071/authored-contexts.mjs','research/evidence-069/freeze-001.json','research/evidence-069/results.json.gz','calibration/cohort-056/profiles.json','calibration/cohort-056/spec.mjs','calibration/cohort-056/question-bindings.json','prototypes/evidence-069/rules.mjs','prototypes/targeted-067/engine.mjs','research/targeted-067/review.mjs','dist/open-explorer.js','dist/open-explorer-056.js','dist/explorer-053-state.js','dist/explorer-053-budget.js','dist/education-routes.js'];
const freeze={version:1,baselineRunId:manifest.runId,previousExperiment:previous.experiment,policy:'Research only. Sixteen question-ID mapping alternatives, twenty-four new activity items, two specialty-context items and seven evidence distinctions, maximum four new items per model. One existing motion/experiment context is encoded with exact original JSON-pointer quotes, without adding numerical, research-reporting or ability preferences. Three exact saved option IDs repair precision/explanation omissions. Mapping repairs reuse existing typed evidence and are not newly administered questions. Existing Yes/No and review holds retained. Added task contexts still require both legacy defining interests and two distinct task domains. Expanded careers retain three defining domains. Two scoped specialist contexts must be explicit; ungrounded inferred optometry/animal-production claims move to confirmation without overwriting answers. Original inputs, scores, ranking formula, Top cap three, pay and routes unchanged. Display all supported education alternatives separately; do not count them as new Top. No outcome, degree, wage, cohort or model identity enters item targeting.',rules:mappingRules071,questions:followupBank071,guards:specialtyGuards071,files:Object.fromEntries(files.map(p=>[p,sha(fs.readFileSync(p))])),plan:cases.map(({c,state})=>({id:c.id,cohort:systemCohort(c),stateHash:sha(JSON.stringify(state)),profileHash:sha(JSON.stringify(profiles.get(c.id)||c.biography))}))};
for(const p of freeze.plan){assert.equal(p.stateHash,oldPlan.get(p.id).stateHash,'Frozen source-state drift '+p.id);assert.equal(p.profileHash,oldPlan.get(p.id).profileHash,'Frozen profile drift '+p.id);}
if(fs.existsSync(root+'freeze-001.json'))assert.deepEqual(read(root+'freeze-001.json'),freeze);else fs.writeFileSync(root+'freeze-001.json',JSON.stringify(freeze,null,2)+'\n');

function apply(s,id,q,d,label){const before=explorerAnswer(s,'profession',id,q),retained=!!before?.reviewHold||['yes','no'].includes(before?.response);
 if(!retained&&d.response==='yes')saveExplorerAnswer(s,{kind:'profession',scope:id,questionId:q.id,payload:{response:'yes',source:'profile-inferred',confidence:'medium',evidence:label+d.evidence.map(x=>x.feature+': '+x.quote).join(' · ')},at:label.startsWith('Research contextual')?'2026-10-21T06:00:00.000Z':'2026-10-21T08:00:00.000Z'});
 const after=explorerAnswer(s,'profession',id,q);if(retained||d.response!=='yes')assert.deepEqual(after,before);
 return{before,after,retained};
}
const rows=[];let knownChecked=0,heldChecked=0;
for(const{c,state}of cases){
 const original=JSON.stringify(state),p=profiles.get(c.id),old=previousById.get(c.id),s=structuredClone(state),beforeResult=explorerResults(s);
 const beforeSupport=beforeResult.rows.filter(r=>r.specific.supported);assert.deepEqual(beforeSupport.map(r=>r.id),base.get(c.id).supported.map(r=>r.id));
 const oldLedger=p?structuredLedger(p,spec):{yes:authoredEvidence[c.id]||{},no:{}};
 for(const id of Object.keys(oldRules))for(const q of explorerCareerQuestions(id).filter(q=>q.kind==='specific'))apply(s,id,q,connect(oldLedger,id,q.domain),'Research contextual evidence: ');
 for(const rule of evidenceRules069){const q=explorerCareerQuestions(rule.careerId).find(q=>q.id===rule.questionId);apply(s,rule.careerId,q,decide(old.ledger,rule),'Research contextual evidence: ');}
 const priorResult=explorerResults(s),priorSupport=priorResult.rows.filter(r=>r.specific.supported);
 assert.deepEqual(priorSupport.map(r=>r.id),old.afterSupported.map(r=>r.id),'0.69 comparator drift '+c.id);
 assert.deepEqual(supportedOrder071(priorResult.rows).map(r=>r.id),priorSupport.map(r=>r.id),'Ranking reproduction drift');
 const contexts=authoredContexts071[c.id]||[];for(const entry of contexts)for(const ref of entry.refs)assert.equal(ref.path.split('.').reduce((v,k)=>v?.[k],c.biography),ref.quote,'Source annotation must equal original profile field');
 const priorState=structuredClone(s),ledger=ledger071(old.ledger,p,state,bindings,spec,contexts,oldLedger.yes),checks=[];
 for(const rule of mappingRules071){const q=explorerCareerQuestions(rule.careerId).find(q=>q.id===rule.questionId),d=decide(ledger,rule),{before,after,retained}=apply(s,rule.careerId,q,d,'Research 0.71 mapping evidence: ');
  checks.push({questionId:q.id,careerId:rule.careerId,before:before?.response??null,after:after?.response??null,beforeHash:sha(JSON.stringify(before??null)),afterHash:sha(JSON.stringify(after??null)),retained,hold:before?.reviewHold||null,decision:d.response,missing:d.missing,blocked:d.blocked,used:[...new Set(d.evidence.map(e=>e.feature))]});
 }
 const mapped=explorerResults(s),offered=selectFollowups071(mapped.rows,ledger),answers={};
 assert.ok(offered.length<=4);assert.equal(new Set(offered.map(q=>q.id)).size,offered.length);
 for(const q of offered)answers[q.id]=simulate071(q,ledger);
 const direct=Object.fromEntries(Object.keys(specialtyGuards071).map(id=>[id,explorerAnswer(s,'profession',id,explorerCareerQuestions(id).find(q=>q.domain==='domain'))]));
 const finalRows=researchRows071(mapped.rows,answers,ledger,direct),support=supportedOrder071(finalRows),compact=r=>({id:r.id,title:r.o.title,fields:r.fields,r:r.r,routes:educationRoutesFor(r.o),budget:explorerBudget(s,r.o),supported:r.specific.supported,missing:r.specific.missing.map(q=>q.id),contrary:r.specific.contrary.map(q=>q.questionId),specificDomains:r.specific.specificDomains,taskDomains:r.specific.taskDomains});
 const beforeTop=beforeSupport.slice(0,3).map(compact),priorTop=priorSupport.slice(0,3).map(compact),afterTop=support.slice(0,3).map(compact),priorIds=new Set(priorSupport.map(r=>r.id)),afterIds=new Set(support.map(r=>r.id));
 const newSupported=support.filter(r=>!priorIds.has(r.id)).map(r=>({...compact(r),evidence:r.specific.evidence})),reclassified=priorSupport.filter(r=>!afterIds.has(r.id)).map(r=>({...compact(r),confirmation:finalRows.find(x=>x.id===r.id).confirmation071}));
 for(const r of reclassified)assert.ok(specialtyGuards071[r.id]&&r.confirmation,'Support lost outside scoped context guard');
 for(const[id,qs]of Object.entries(priorState.explorer053?.professionAnswers||{}))for(const[qid,a]of Object.entries(qs))if(a?.reviewHold||['yes','no'].includes(a?.response)){assert.deepEqual(s.explorer053.professionAnswers[id][qid],a);knownChecked++;heldChecked+=!!a.reviewHold;}
 for(const o of old.afterSupported){assert.deepEqual(explorerBudget(s,mapped.rows.find(x=>x.id===o.id).o),o.budget,'Budget changed '+c.id+' / '+o.id);}
 assert.equal(JSON.stringify(state),original,'Source state changed');
 const candidateIds=new Set([...old.candidates.map(x=>x.id),...mappingRules071.map(x=>x.careerId),...offered.flatMap(q=>q.careerIds)]);
 const candidates=finalRows.filter(r=>!r.specific.supported&&(r.confirmation071||candidateIds.has(r.id))).map(r=>({...compact(r),confirmation:r.confirmation071}));
 const gained=(from,pred)=>!from.some(pred)&&afterTop.some(pred),lost=(from,pred)=>from.some(pred)&&!afterTop.some(pred),grad=x=>x.routes.some(r=>r.key==='graduate');
 rows.push({id:c.id,name:base.get(c.id).name,cohort:systemCohort(c),phase:c.phase,source:p?'Structured profile':'Authored saved choices',ledger,checks,followups:offered.map(q=>({questionId:q.id,...answers[q.id]})),beforeTop,priorTop,afterTop,priorSupported:old.afterSupported,afterSupported:support.map(compact),newSupported,reclassified,candidates,changed:JSON.stringify(priorTop.map(p=>p.id))!==JSON.stringify(afterTop.map(p=>p.id)),gainedTop:gained(priorTop,()=>true),lostTop:lost(priorTop,()=>true),gainedDegree:gained(priorTop,bachelorGraduate),lostDegree:lost(priorTop,bachelorGraduate),gainedGraduate:gained(priorTop,grad),lostGraduate:lost(priorTop,grad),gainedCovers:gained(priorTop,p=>p.budget.covers===true),lostCovers:lost(priorTop,p=>p.budget.covers===true),degreeAlternatives:support.map(compact).filter(p=>bachelorGraduate(p)&&!afterTop.some(t=>t.id===p.id))});
 if(rows.length%100===0)console.log('Evidence/follow-up benchmark: '+rows.length+' / 1000');
}
const groups=['all','development','holdout','holdout049','holdout056'];
const summary=Object.fromEntries(groups.map(group=>{const rs=rows.filter(r=>group==='all'||r.cohort===group),count=f=>rs.filter(f).length,s={models:rs.length};
 for(const arm of['before','prior','after']){s[arm+'Top']=count(r=>r[arm+'Top'].length);s[arm+'Degree']=count(r=>r[arm+'Top'].some(bachelorGraduate));s[arm+'Graduate']=count(r=>r[arm+'Top'].some(p=>p.routes.some(x=>x.key==='graduate')));s[arm+'Covers']=count(r=>r[arm+'Top'].some(p=>p.budget.covers===true));}
 s.priorAnyDegree=count(r=>r.priorSupported.some(bachelorGraduate));s.afterAnyDegree=count(r=>r.afterSupported.some(bachelorGraduate));s.priorDegreeBelowCap=count(r=>!r.priorTop.some(bachelorGraduate)&&r.priorSupported.some(bachelorGraduate));s.afterDegreeBelowCap=count(r=>!r.afterTop.some(bachelorGraduate)&&r.afterSupported.some(bachelorGraduate));
 for(const key of['gainedTop','lostTop','gainedDegree','lostDegree','gainedGraduate','lostGraduate','gainedCovers','lostCovers','changed'])s[key]=count(r=>r[key]);
 s.newClaims=rs.reduce((n,r)=>n+r.newSupported.length,0);s.reclassifiedClaims=rs.reduce((n,r)=>n+r.reclassified.length,0);s.reclassifiedModels=count(r=>r.reclassified.length);s.mappingFills=rs.reduce((n,r)=>n+r.checks.filter(q=>q.beforeHash!==q.afterHash).length,0);s.followups=rs.reduce((n,r)=>n+r.followups.length,0);s.offeredModels=count(r=>r.followups.length);s.positiveActivities=rs.reduce((n,r)=>n+r.followups.filter(q=>q.selected.length).length,0);s.unknownActivities=s.followups-s.positiveActivities;return[group,s];}));
assert.deepEqual(groups.map(g=>summary[g].models),[1000,758,30,12,200]);assert.deepEqual([summary.all.beforeTop,summary.all.beforeDegree,summary.all.priorTop,summary.all.priorDegree,summary.all.priorAnyDegree],[789,653,812,683,748]);
const claimCounts=Object.values(rows.flatMap(r=>r.newSupported.map(p=>({...p,cohort:r.cohort}))).reduce((a,p)=>{const v=a[p.id]??={id:p.id,title:p.title,routes:p.routes,budgetExample:p.budget,models:0,development:0,holdout:0,holdout049:0,holdout056:0};v.models++;v[p.cohort]++;return a;},{}));
const questionCounts=followupBank071.map(q=>({...q,...Object.fromEntries(groups.map(g=>{const xs=rows.filter(r=>g==='all'||r.cohort===g).flatMap(r=>r.followups.filter(a=>a.questionId===q.id));return[g,{offered:xs.length,positive:xs.filter(a=>a.selected.length).length,unknown:xs.filter(a=>!a.selected.length).length}];}))}));
for(const[p,h]of Object.entries(freeze.files))assert.equal(sha(fs.readFileSync(p)),h,'Frozen input changed '+p);
const out={experiment:'evidence-071-v1',baselineRunId:manifest.runId,previousExperiment:previous.experiment,freezeSHA256:sha(JSON.stringify(freeze)),summary,rules:mappingRules071,questionDefinitions:definitions,questionBank:followupBank071,questionCounts,guards:specialtyGuards071,claimCounts,checks:{models:1000,mappingRules:mappingRules071.length,activityItems:activityBank071.length,specialtyItems:2,evidenceItems:followupBank071.length-activityBank071.length-2,existingFactEncodings:Object.keys(authoredContexts071).length,maxNewItems:4,knownAnswersChecked:knownChecked,heldRecordsChecked:heldChecked,knownAnswersOverwritten:0,holdsOverwritten:0,sourceStatesChanged:0,newProfilePreferences:0,liveFlowChanges:0},limitations:['Research-only semantic and question-bank prototype, not independently validated question scales or observed student outcomes.','All source profiles, original response records and frozen interests are unchanged. New answers only reuse explicit typed facts/eligible exact option IDs; unavailable interests remain unfamiliar. No prose or job-title matching. One existing original motion/experiment context is explicitly encoded with exact source-field verification; the source profile and its unknown preferences are unchanged.','Sixteen mapping repairs reuse existing evidence; these are not newly observed answers. At most four newly offered activity/context questions per model are simulated. Selection uses prior evidence gaps and correlation, not degree, earnings, cohort, identity or desired coverage.','The existing legacy gate still requires both defining interests and two distinct activity domains. Expanded roles still require three defining domains. The two scoped specialist roles additionally need their actual vision or farm-production context. Existing response records remain unchanged when a claim moves to confirmation.','All supported education routes are retained alongside the first three highlights. Degree alternatives below that cap are not counted as new degree Top. College/graduate uses canonical route keys; associate-only routes are separate.','Pay, education routes, budget assumptions, correlation scores and ranking formula are unchanged. New activity evidence may change tie ordering and which three careers are highlighted. Missing pay remains unassessed.','Development and all three previously inspected holdouts use the same frozen rules with separate results. They are diagnostic, not pristine final validation.'],rows};
fs.writeFileSync(root+'results.json.gz',gzipSync(JSON.stringify(out),{level:9}));fs.writeFileSync(root+'summary.json',JSON.stringify({...out,rows:undefined,questionDefinitions:undefined},null,2)+'\n');fs.writeFileSync('dist/developer/evidence-benchmark-071.json.gz',gzipSync(JSON.stringify(out),{level:9}));
console.log(JSON.stringify({summary,checks:out.checks},null,2));
export{out as evidenceBenchmark071};
