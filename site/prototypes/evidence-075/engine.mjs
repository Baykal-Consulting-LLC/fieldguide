// Research-only semantic corrections. Exact choice IDs, no prose classifier.
import {decide,evidenceRules069,activityContexts} from '../evidence-069/rules.mjs';
import {mappingRules071,followupBank071} from '../evidence-071/engine.mjs';
import {bindingRules073,additionalQuestions073} from '../evidence-073/engine.mjs';
const patches=[];
const drop=(ids,features,reason)=>{for(const optionId of ids)patches.push({optionId,remove:features,reason});};
drop(['business-problem-3','business-evidence-2','business-people-1','business-people-5','business-refine-1-2','business-refine-1-4','business-refine-2-2','business-refine-2-4','business-refine-3-2','business-refine-3-4','business-refine-4-2','business-refine-4-4','technology-result-2'],['m:quantitative'],'Understanding people, planning, persuasion or an unspecified analysis does not establish numerical analysis. Retain the original substantive interests.');
drop(['building-design-4','building-impact-3','building-refine-1-2','building-refine-3-2','building-refine-4-2'],['m:quantitative'],'A structure, movement pattern or physical model is not itself a stated preference for calculations; explicit calculation choices remain available.');
drop(['transportation-production-problem-3','transportation-production-refine-1-3','transportation-production-refine-2-3','transportation-production-refine-3-3'],['m:quantitative','m:testing'],'A goal of smoother production does not establish numerical measurement or controlled testing. The explicit measure-and-improve option is retained.');
drop(['creative-workday-2','creative-refine-3-4'],['t:media'],'A disjunction of images, movement, light or sound does not establish filmed-media interest specifically.');
drop(['creative-make-2','creative-revise-2','creative-refine-1-3','creative-refine-2-3','creative-refine-3-2','creative-refine-4-3'],['t:mechanics'],'Useful-object and product design need not concern a moving mechanical system. Physical-product/design evidence remains.');
drop(['technology-workday-1'],['f:code-test'],'Testing small digital changes does not specify writing or tracing code. Explicit code/debug choices remain.');
drop(['building-design-1'],['f:physical-prototype'],'Interest in machines and moving parts does not itself report making or testing a prototype.');
drop(['science-workday-1'],['f:lab-procedure'],'Repeating a procedure and keeping records does not specify a laboratory, sample preparation or controlled biological experiment.');
export const optionCorrections075=patches;
const patchMap=new Map(patches.map(p=>[p.optionId,p]));
export function cleanLedger075(prior,bindings){
 const l=structuredClone(prior),audit=[],lost=[];
 for(const side of ['yes','no'])for(const [feature,refs]of Object.entries(l[side])){
  const keep=refs.filter(ref=>{const p=patchMap.get(ref.optionId);if(!p?.remove.includes(feature))return true;if(bindings.options[ref.optionId]?.questionId!==ref.questionId)return true;audit.push({side,feature,optionId:ref.optionId,questionId:ref.questionId,quote:ref.quote,reason:p.reason});return false;});
  if(keep.length)l[side][feature]=keep;else{delete l[side][feature];if(side==='yes')lost.push(feature);}
 }
 // Explicitly laboratory-specific source choices; a generic repeated method cannot substitute.
 for(const refs of Object.values(prior.yes))for(const ref of refs)if(['science-setting-1','science-refine-3-2'].includes(ref.optionId)&&bindings.options[ref.optionId]?.questionId===ref.questionId){l.yes['f:lab-procedure']??=[];if(!l.yes['f:lab-procedure'].some(r=>r.optionId===ref.optionId&&r.questionId===ref.questionId))l.yes['f:lab-procedure'].push(ref);}
 return{ledger:l,audit,lost:lost.filter(k=>!l.yes[k]?.length)};
}
export function auditOptions075(bindings){return Object.entries(bindings.options).map(([id,b])=>({id,questionId:b.questionId,text:b.text,review:patchMap.has(id)?'Narrowed unsupported implication':'Retained within stated scope',correction:patchMap.get(id)||null,original:{topics:b.topicAll||[],methods:b.methodAll||[],responsibilities:b.responsibilityAll||[],topicAny:b.topicAny||[],methodAny:b.methodAny||[]},limits:'Internal semantic review of exact answer-to-feature links. Not independent psychometric validation; absence of a correction is not a validity claim.'}));}
function requirements(b){const g=x=>!x?.length?[]:Array.isArray(x[0])?x:[x];return{all:[...(b.topicAll||[]).map(x=>'t:'+x),...(b.methodAll||[]).map(x=>'m:'+x),...(b.responsibilityAll||[]).map(x=>'r:'+x),...(b.specificAll||[]).map(x=>'s:'+x)],any:[...g(b.topicAny).map(a=>a.map(x=>'t:'+x)),...g(b.methodAny).map(a=>a.map(x=>'m:'+x))],block:[]};}
export const reviewedRules075=new Map([...evidenceRules069,...mappingRules071,...bindingRules073].map(r=>[r.questionId,r]));
const prompts=[
 ['workflow-delays','management-analyst','management-analyst-interest-044-1','An event has recurring delays. How appealing would it be to compare waiting times and staffing notes across several events to find where the delays begin?','f:workflow-delay-measures075'],
 ['workflow-revision','management-analyst','management-analyst-interest-044-2','How appealing would it be to test a different arrangement with the team, track the results, and revise your recommendation if it did not help?','f:workflow-change-trial075'],
 ['data-validation','degree-43911100','degree-43911100-047-domain','An attendance chart suggests an activity is becoming more popular. How appealing would it be to check missing counts and changed recording methods before deciding what the pattern means?','f:data-definition-check075'],
 ['data-preparation','degree-43911100','degree-43911100-047-method','How appealing would it be to regularly prepare the attendance records, run a specified calculation, and check the tables so the group can rely on the results?','f:statistical-preparation075'],
 ['plant-comparison','biological-technician','biological-technician-interest-044-1','How appealing would it be to compare two ways of growing plant cuttings, keep other conditions similar, and record measurements for several weeks even if no clear pattern appears?','f:controlled-plant-comparison075'],
 ['plant-samples','biological-technician','biological-technician-interest-044-2','How appealing would it be to prepare, label and measure plant or soil samples using a written procedure, then check the records for a research team?','f:plant-sample-procedure075']
];
export const targetedQuestions075=prompts.map(([key,careerId,targetQuestionId,prompt,feature],i)=>({id:'followup075-'+key,key,careerId,targetQuestionId,prompt,feature,pair:i%2===0?'first':'second',after:i%2===1?'followup075-'+prompts[i-1][0]:null,kind:'scoped-interest',choices:[{value:5,text:'Very interested'},{value:4,text:'Interested'},{value:3,text:'Neither interested nor uninterested'},{value:2,text:'Uninterested'},{value:1,text:'Very uninterested'},{value:0,text:'Not sure / would need a preview'}],simulation:{requiresExactFeature:feature,missing:'unknown'},status:'Authored diagnostic draft grounded in reviewed occupational tasks; not an independently validated scale item.'}));
export function scopedAnswer075(q,ledger,direct={}){const v=direct[q.key];if(v!==undefined){if(!Number.isInteger(v)||v<0||v>5)throw Error('Invalid direct item response');return{questionId:q.id,value:v,status:v===0?'unknown':v>=4?'positive':v<=2?'negative':'neutral',source:'grok-frozen-item-response',refs:[{source:'grok-frozen-item-response',questionId:q.id,value:v}]};}const refs=ledger.yes[q.feature]||[];return{questionId:q.id,value:refs.length?4:0,status:refs.length?'positive':'unknown',source:'frozen-structured-evidence',refs};}
// Raw answer records are immutable. Only effective support dependent on removed
// implications is quarantined; explicit No/Unsure/holds cannot be turned into Yes.
export function revalidate075(rows,before,clean,bindings,records={}){
 const audit=[],out=structuredClone(rows),lost=new Set(Object.keys(before.yes).filter(k=>before.yes[k]?.length&&!clean.yes[k]?.length));
 for(const r of out){for(const q of r.specific.evidence.filter(e=>e.kind==='specific'||e.kind==='core-work')){
  const rule=reviewedRules075.get(q.questionId)||(bindings.questions[q.questionId]?requirements(bindings.questions[q.questionId]):null);if(!rule)continue;
  const d=decide(clean,rule),prior=decide(before,rule),bad=d.missing.filter(k=>lost.has(k));
  const stats=r.id==='degree-43911100'&&['method','responsibility'].includes(q.domain)&&q.evidence?.startsWith('Research 0.73 mapping evidence: ')&&!clean.yes['f:statistical-preparation075']?.length;
  if(!bad.length&&!stats)continue;
  const record=records[q.questionId],direct=record?.source==='student'&&['yes','no','unsure'].includes(record?.response);
  if(direct||q.source!=='profile-inferred'){audit.push({careerId:r.id,questionId:q.questionId,status:'Original explicit record retained; mapping flag only',features:bad});continue;}
  // Specific domains use legacy question IDs or expanded domain names.
  const domain=q.domain;r.specific.specificDomains=r.specific.specificDomains.filter(x=>x!==domain);r.specific.evidence=r.specific.evidence.filter(e=>e!==q);if(!r.specific.missing.some(x=>x.id===q.questionId))r.specific.missing.push({id:q.questionId,prompt:q.prompt||q.text});
  r.specific.supported=false;r.corrections075??=[];const note={careerId:r.id,questionId:q.questionId,status:'Derived confirmation withdrawn; original answer preserved',features:stats?['f:statistical-preparation075']:bad,beforeDecision:prior.response,afterDecision:d.response,reason:stats?'General information accuracy does not establish recurring numerical preparation.':'The surviving structured evidence no longer supplies the required construct.'};r.corrections075.push(note);audit.push(note);
 }}return{rows:out,audit};
}
export function targetedRound075(rows,ledger,direct={},records={},limit=4){
 const out=structuredClone(rows),answers=[],touched=new Set(),plans=targetedQuestions075.filter(q=>q.pair==='first').map(q=>({q,r:out.find(r=>r.id===q.careerId)})).filter(x=>x.r&&!x.r.specific.contrary.length&&(x.r.corrections075?.length||x.r.r<0&&x.r.specific.supported||!x.r.specific.supported&&x.r.specific.specificDomains.length>0)).sort((a,b)=>Number(!!b.r.corrections075?.length)-Number(!!a.r.corrections075?.length)||(b.r.r??-2)-(a.r.r??-2));
 const connect=(q,a,r)=>{if(a.status==='positive'||a.status==='negative')touched.add(r.id);if(a.status==='negative'){r.specific.contrary.push({questionId:q.id,response:'no',source:a.source});r.specific.supported=false;return;}const record=records[q.targetQuestionId];if(record?.reviewHold||['no','unsure'].includes(record?.response)||r.specific.contrary.length||a.status!=='positive')return;const domain=q.targetQuestionId.includes('-047-')?q.targetQuestionId.split('-047-')[1]:q.targetQuestionId;if(!r.specific.specificDomains.includes(domain))r.specific.specificDomains.push(domain);r.specific.missing=r.specific.missing.filter(x=>x.id!==q.targetQuestionId);r.specific.evidence.push({questionId:q.targetQuestionId,answerQuestionId:q.id,kind:'specific',domain,source:a.source,confidence:'medium',text:q.prompt,refs:a.refs});
  // Statistical record preparation also supplies the associated reporting check,
  // only alongside the independently existing explanation and numerical interests.
  if(q.key==='data-preparation'&&ledger.yes['m:explaining']?.length&&ledger.yes['m:quantitative']?.length){const id='degree-43911100-047-responsibility';if(!records[id]?.reviewHold&&!['no','unsure'].includes(records[id]?.response)){if(!r.specific.specificDomains.includes('responsibility'))r.specific.specificDomains.push('responsibility');r.specific.missing=r.specific.missing.filter(x=>x.id!==id);r.specific.evidence.push({questionId:id,answerQuestionId:q.id,domain:'responsibility',kind:'specific',source:a.source,confidence:'medium',text:'Numerical preparation combined with existing explanation interest',refs:a.refs});}}
 };
 for(const {q,r}of plans){if(answers.length>=limit)break;const a=scopedAnswer075(q,ledger,direct);answers.push({...a,careerId:r.id,prompt:q.prompt});connect(q,a,r);if(a.status==='positive'&&answers.length<limit){const next=targetedQuestions075.find(x=>x.after===q.id),b=scopedAnswer075(next,ledger,direct);answers.push({...b,careerId:r.id,prompt:next.prompt});connect(next,b,r);}}
 for(const r of out){if(!touched.has(r.id))continue;const legacy=r.specific.requirement.startsWith('Two distinct');r.specific.supported=!r.specific.contrary.length&&!r.specific.missing.length&&(legacy?r.specific.specificDomains.length===2&&r.specific.taskDomains.length>=2:r.specific.specificDomains.length===3)&&!r.confirmation071;}
 return{rows:out,answers};
}
export function filterReusedAnswers075(answers,ledger){const out={},audit=[];for(const[id,a]of Object.entries(answers)){const q=[...followupBank071,...additionalQuestions073].find(q=>q.id===id);if(!q||!a.selected?.length){out[id]=a;continue;}const options=q.options.filter(o=>a.selected.includes(o.id)),valid=options.every(o=>decide(ledger,o).response==='yes');if(valid){out[id]=a;continue;}out[id]={...a,selected:[],feedback:'unfamiliar',confidence:'low',evidence:'Prior inferred choice depends on a corrected implication; raw transcript retained.'};audit.push({questionId:id,status:'Inferred activity confirmation quarantined; raw response preserved'});}return{answers:out,audit};}
