// Research-only answer bridge. Frozen 0.71 and production modules stay immutable.
import {decide,eligible,evidenceRules069} from '../evidence-069/rules.mjs';
import {followupBank071,activityBank071,researchRows071,supportedOrder071,mappingRules071} from '../evidence-071/engine.mjs';
export {supportedOrder071 as supportedOrder073};
const exact={
 'business-refine-1-3':'workflow-study','business-problem-2':'workflow-study',
 'business-refine-4-3':'workflow-review','science-workday-1':'lab-procedure',
 'technology-refine-3-2':'statistical-records',
 'transportation-production-refine-1-2':'stock-materials',
 'business-refine-4-2':'message-trial'
};
export function ledger073(prior,bindings){const l=structuredClone(prior);for(const refs of Object.values(prior.yes))for(const r of refs){const f=exact[r.optionId];if(!f||bindings.options[r.optionId]?.questionId!==r.questionId)continue;const key='f:'+f;l.yes[key]??=[];if(!l.yes[key].some(x=>x.optionId===r.optionId&&x.questionId===r.questionId))l.yes[key].push(r);}return l;}
const rules=[];
function add(careerId,suffix,all,reason,any=[]){rules.push({careerId,questionId:careerId+(suffix.startsWith('-')?suffix:'-047-'+suffix),all,any,block:[],reason});}
for(const n of [1,2])add('biological-technician','-interest-044-'+n,['t:biology','f:lab-procedure','m:testing','m:precision'],'Biology plus an explicitly chosen repeatable procedure/record context supports the laboratory interest; plant care or a science rating alone is insufficient.');
add('degree-43911100','domain',['t:statistics','f:statistical-limits'],'Concrete dataset/assumptions context is required, beyond a broad statistics rating.');
add('degree-43911100','method',['t:statistics','f:statistical-limits','m:quantitative','m:precision','m:organization'],'Keep numerical, accurate and organized study-record evidence.');
add('degree-43911100','responsibility',['t:statistics','f:statistical-limits','m:quantitative','m:precision','m:organization','m:explaining'],'Explaining study results is a separate requirement; do not infer research leadership.');
add('management-analyst','-interest-044-1',['t:enterprise','f:workflow-study','m:investigation','m:quantitative'],'A chosen team/workflow investigation supplies the organizational context. Existing numerical/investigation requirements remain.');
add('management-analyst','-interest-044-2',['t:enterprise','f:workflow-study','f:workflow-review','m:investigation','m:quantitative','m:coordination'],'A distinct project-review/coordination context is needed before inferring interest in implementing organizational changes.');
add('logistics','-interest-044-1',['t:logistics','m:quantitative','m:organization'],'Stock/materials or a concrete delivery-comparison context is required.',[['f:stock-materials','f:delay-records']]);
add('logistics','-interest-044-2',['t:logistics','f:delay-records','m:quantitative','m:organization','m:coordination'],'Generic appointments or office records do not establish supplier/delivery coordination.');
add('public-relations','-interest-044-1',['t:marketing','f:message-trial','m:explaining','m:persuading'],'Testing an audience message supplies a concrete communication context; negotiating a purchase alone does not.');
// No automatic PR responsibility fill: use the neutral group-update distinction.
export const bindingRules073=rules;
const scoped={
 'evidence071-physical-model':'physical-model-choice',
 'evidence071-research-report':'research-report-choice',
 'evidence071-event-commitments':'event-commitments-choice',
 'evidence071-safety-accountability':'technical-safety-choice',
 'evidence071-curriculum-review':'curriculum-review-choice',
 'evidence071-educator-coaching':'educator-coaching-choice',
 'evidence071-client-budget':'client-budget-choice',
 'followup073-workflow-review':'workflow-review-choice',
 'followup073-group-update':'group-update-choice',
 'followup073-supply-change':'supply-change-choice'
};
const extra=(id,careerIds,prompt,text,all)=>({id,careerIds,prompt,kind:'evidence',domain:'scoped',options:[{id:id+'-try',text,all,any:[],block:[]}],alternatives:[{id:id+'-other',text:'I would choose a different part of the activity'},{id:id+'-unknown',text:'Not sure / have not tried'}]});
export const additionalQuestions073=[
 extra('followup073-workflow-review',['management-analyst'],'Which part of improving a small team project would you choose?','Compare how a revised plan worked and coordinate the next change with the people using it.',['f:workflow-study','f:workflow-review','m:investigation','m:coordination']),
 extra('followup073-group-update',['public-relations'],'Which communication activity would you choose to explore?','Prepare an accurate update on behalf of a group, compare how people understood it and respond to questions or criticism.',['f:public-group-update','m:explaining','m:persuading','m:precision']),
 extra('followup073-supply-change',['logistics'],'Which planning activity would you choose?','Compare a delayed delivery with the stock records, then coordinate a revised plan and explain its limits.',['f:delay-records','m:organization','m:quantitative','m:coordination'])
];
function requirements(binding){const groups=x=>!x?.length?[]:Array.isArray(x[0])?x:[x];return{all:[...(binding.topicAll||[]).map(x=>'t:'+x),...(binding.methodAll||[]).map(x=>'m:'+x),...(binding.responsibilityAll||[]).map(x=>'r:'+x),...(binding.specificAll||[]).map(x=>'s:'+x)],any:[...groups(binding.topicAny).map(g=>g.map(x=>'t:'+x)),...groups(binding.methodAny).map(g=>g.map(x=>'m:'+x))],block:[]};}
// Taxonomy IDs and exact requirement IDs, never occupation-title word matching.
export function bridgeRegistry073(bindings,questionsFor){
 const out=[],register=(questionId,careerId,qid,domain,all=[],anchorDomains=[])=>out.push({questionId,careerId,targetQuestionId:qid,domain,all,anchorDomains});
 const reg=(qid,id,domain,all=[],anchors=[])=>register(qid,id,id+'-047-'+domain,domain,all,anchors);
 reg('evidence071-physical-model','degree-19201200','domain');
 reg('evidence071-research-report','degree-19201200','responsibility',[],['domain','method']);
 reg('evidence071-research-report','degree-19309300','responsibility',[],['domain','method']);
 reg('evidence071-event-commitments','degree-13112100','responsibility',[],['domain','method']);
 reg('evidence071-curriculum-review','degree-25903100','method',['t:learning'],['domain']);
 reg('evidence071-educator-coaching','degree-25903100','responsibility',['t:learning'],['domain']);
 reg('evidence071-client-budget','degree-13207100','responsibility',['t:finance'],['domain','method']);
 register('followup073-workflow-review','management-analyst','management-analyst-interest-044-2','management-analyst-interest-044-2',['t:enterprise','f:workflow-study']);
 register('followup073-group-update','public-relations','public-relations-interest-044-2','public-relations-interest-044-2',['t:marketing']);
 register('followup073-supply-change','logistics','logistics-interest-044-2','logistics-interest-044-2',['t:logistics','m:organization']);
 const overrides=new Map([...evidenceRules069,...mappingRules071].map(r=>[r.questionId,r]));
 for(const [qid,b] of Object.entries(bindings.questions)){
  const id=b.careerId;if(!id||!(/^degree-17\d+$/.test(id)||['mechanical-engineering','electrical-engineering','architecture'].includes(id)))continue;
  const q=questionsFor(id).find(q=>q.id===qid);if(q?.kind!=='specific')continue;
  const req=overrides.get(qid)||requirements(b);if(!req.all.includes('r:safety'))continue;
  out.push({questionId:'evidence071-safety-accountability',careerId:id,targetQuestionId:qid,domain:q.domain||q.id,all:req.all.filter(f=>f!=='r:safety'),any:req.any,block:[...(req.block||[]),'r:safety'],anchorDomains:[]});
 }
 for(const x of out)if(!questionsFor(x.careerId).some(q=>q.id===x.targetQuestionId))throw Error('Invalid bridge target '+x.targetQuestionId);
 return out;
}
export function questionPool073(registry){return [...followupBank071.map(q=>q.kind==='evidence'?{...q,careerIds:[...new Set(registry.filter(r=>r.questionId===q.id).map(r=>r.careerId))]}:q),...additionalQuestions073];}
const roots=refs=>[...new Set((refs||[]).map(r=>JSON.stringify([r.source||'',r.path||'',r.id||'',r.questionId||'',r.optionId||''])))].sort();
export function consumeAnswers073(ledger,answers,pool){const l=structuredClone(ledger),consumed=[];for(const q of pool.filter(q=>scoped[q.id])){
 const key='e:'+scoped[q.id];delete l.yes[key];delete l.no[key];const a=answers[q.id];if(!a||!eligible(a))continue;const ids=new Set([...(q.options||[]),...(q.alternatives||[])].map(o=>o.id));if((a.selected||[]).some(id=>!ids.has(id)))continue;
 const option=q.options.find(o=>a.selected?.includes(o.id));
 if(!a.feedback&&option){const reference={source:'scoped-multiple-choice',questionId:q.id,optionId:option.id,quote:option.text,sourceRoots:roots(a.refs),reused:a.source==='profile-inferred'};l.yes[key]=[reference];consumed.push({questionId:q.id,feature:key,status:'positive',sourceRoots:reference.sourceRoots,reused:reference.reused});}
 else consumed.push({questionId:q.id,feature:key,status:a.feedback==='unfamiliar'||!a.selected?.length?'unknown':'other',sourceRoots:[],reused:a.source==='profile-inferred'});
 }return{ledger:l,consumed};}
function protectedRecord(a){return a?.reviewHold||['yes','no','unsure'].includes(a?.response);}
export function applyBridge073(rows,answers,ledger,records,registry,pool,priorIds=new Set()){
 const {ledger:l,consumed}=consumeAnswers073(ledger,answers,pool),audit=[];
 let result=researchRows071(rows,answers,l,records.specialties||{}).map(r=>({...r,specific:{...r.specific,evidence:[...r.specific.evidence],specificDomains:[...r.specific.specificDomains],missing:[...r.specific.missing]}}));
 for(const r of result)for(const rule of registry.filter(x=>x.careerId===r.id)){
  const feature='e:'+scoped[rule.questionId],a=records.byQuestion?.[rule.targetQuestionId],has=!!l.yes[feature]?.length,d=decide(l,{all:[feature,...rule.all],any:rule.any||[],block:rule.block||[]}),anchors=rule.anchorDomains.every(x=>r.specific.specificDomains.includes(x));
  const blocked=protectedRecord(a)||r.specific.contrary.length||!anchors||d.response!=='yes';
  if(has)audit.push({careerId:r.id,questionId:rule.questionId,targetQuestionId:rule.targetQuestionId,status:protectedRecord(a)?'Recorded answer retained':r.specific.contrary.length?'Contrary interest retained':!anchors?'Other defining interests unresolved':d.response!=='yes'?'Other required evidence unresolved':'Scoped choice connected',missing:d.missing,blocked:d.blocked});
  if(blocked||r.specific.specificDomains.includes(rule.domain))continue;
  r.specific.specificDomains.push(rule.domain);r.specific.missing=r.specific.missing.filter(q=>q.id!==rule.targetQuestionId);
  r.specific.evidence.push({questionId:rule.targetQuestionId,answerQuestionId:rule.questionId,domain:rule.domain,kind:'specific',source:'scoped-followup',confidence:'medium',text:pool.find(q=>q.id===rule.questionId).prompt,evidence:l.yes[feature][0].quote,refs:l.yes[feature]});
 }
 for(const r of result){const legacy=r.specific.requirement.startsWith('Two distinct');r.specific.supported=!r.specific.contrary.length&&!r.specific.missing.length&&(legacy?r.specific.specificDomains.length===2&&r.specific.taskDomains.length>=2:r.specific.specificDomains.length===3)&&!r.confirmation071;
  if(r.id==='degree-25903100'&&!priorIds.has(r.id)&&r.specific.supported&&!l.yes['e:educator-coaching-choice']?.length&&!l.yes['f:educator-coaching']?.length){r.specific.supported=false;r.specific.missing.push({id:'evidence071-educator-coaching',prompt:'Interest in coaching educators remains unconfirmed.'});}
 }
 return{rows:result,ledger:l,consumed,audit};
}
export function selectQuestions073(rows,registry,pool,previousAnswers,records={}){
 const byId=new Map(rows.map(r=>[r.id,r])),plans=[];
 for(const [index,q]of pool.entries()){
  if(previousAnswers[q.id])continue;
  const need=q.careerIds.map(id=>byId.get(id)).filter(Boolean).filter(r=>!r.specific.supported&&!r.specific.contrary.length&&!r.confirmation071&&r.specific.specificDomains.length>0);
  if(!need.length)continue;
  const targets=registry.filter(x=>x.questionId===q.id&&need.some(r=>r.id===x.careerId&&r.specific.missing.some(m=>m.id===x.targetQuestionId))&&!protectedRecord(records[x.targetQuestionId]));
  const activity=q.kind==='activity'&&need.some(r=>r.specific.specificDomains.length===2&&!r.specific.taskDomains.includes(q.domain));
  if(!targets.length&&!activity)continue;
  plans.push({q,index,targets:targets.map(t=>({careerId:t.careerId,questionId:t.targetQuestionId})),priority:[Number(need.some(r=>r.specific.missing.length===1)),Math.max(...need.map(r=>r.specific.specificDomains.length)),Number(activity),Math.max(...need.map(r=>r.r??-2))]});
 }
 plans.sort((a,b)=>{for(let i=0;i<a.priority.length;i++)if(a.priority[i]!==b.priority[i])return b.priority[i]-a.priority[i];return a.index-b.index;});return plans.slice(0,4);
}
export {roots as evidenceRoots073};
