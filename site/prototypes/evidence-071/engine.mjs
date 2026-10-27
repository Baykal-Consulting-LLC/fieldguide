// Research only. Every connection consumes explicit feature/option IDs.
// No job-title, biography, demographic, earnings or degree-preference classifier.
import {decide,eligible} from '../evidence-069/rules.mjs';
const ref=(path,id,quote)=>({source:'frozen-structured-profile',path,id,quote});
const put=(l,k,refs)=>{if(refs?.length)l.yes[k]=refs;};
export const exactContexts071={
 'creative-make-2':['physical-product'],
 'building-design-1':['physical-prototype'],
 'education-approach-4':['reference-help'],
 'education-refine-3-4':['source-comparison']
};
export const exactMethods071={'science-workday-1':['precision'],'science-workday-4':['explaining'],'science-refine-3-2':['precision']};
export function ledger071(prior,profile,state,bindings,spec,reviewedContexts=[],priorTyped={}){
 const l=structuredClone(prior),facts=(kind,id)=>l.yes[kind+':'+id]||[];
 if(profile){
  // These are the concrete original topic facts, not a new topic inferred from a career Yes.
  if(facts('t','information').length){put(l,'f:reference-help',facts('t','information'));if(facts('m','investigation').length)put(l,'f:source-comparison',[...facts('t','information'),...facts('m','investigation')]);}
  if(facts('t','mechanics').length)put(l,'f:physical-prototype',facts('t','mechanics'));
  if(facts('t','mechanics').length&&facts('t','visual').length)put(l,'f:physical-product',[...facts('t','mechanics'),...facts('t','visual')]);
  if(facts('t','mechanics').length&&facts('m','testing').length&&facts('m','quantitative').length)put(l,'f:physical-model',[...facts('t','mechanics'),...facts('m','testing'),...facts('m','quantitative')]);
  if(profile.specialtyPreferences060?.['eye-treatment']==='yes')put(l,'f:vision-examination',[ref('specialtyPreferences060','eye-treatment',bindings.specificFeatures060['eye-treatment'])]);
  if(profile.specialtyPreferences060?.['eye-treatment']==='no')l.no['f:vision-examination']=[ref('specialtyPreferences060','eye-treatment','Explicit negative eye-treatment preference')];
 }else{
  const answers=[];
  for(const f of new Set([...Object.keys(state.profileJourney?.depth||{}),...Object.keys(state.explorer053?.fieldAnswers||{})]))for(const[qid,raw]of Object.entries({...state.profileJourney?.depth?.[f],...state.explorer053?.fieldAnswers?.[f]}))answers.push([qid,Array.isArray(raw)?{selected:raw,source:'student',confidence:'high'}:raw]);
  for(const qs of Object.values(state.explorer053?.professionAnswers||{}))for(const[qid,a]of Object.entries(qs))if(a?.selected)answers.push([qid,a]);
  for(const[qid,a]of answers)if(eligible(a)&&!a.feedback)for(const optionId of a.selected||[]){const b=bindings.options[optionId];if(!b||b.questionId!==qid)continue;const r={source:'saved-activity-option',questionId:qid,optionId,quote:b.text};for(const k of exactContexts071[optionId]||[])put(l,'f:'+k,[...(l.yes['f:'+k]||[]),r]);for(const k of exactMethods071[optionId]||[])put(l,'m:'+k,[...(l.yes['m:'+k]||[]),r]);}
 }
 for(const entry of reviewedContexts)put(l,entry.feature,entry.refs);
 if(priorTyped['history.compares-records']?.length)put(l,'f:source-comparison',[...(l.yes['f:source-comparison']||[]),...priorTyped['history.compares-records']]);
 return l;
}
const rules=[];
function rule(careerId,suffix,all,reason,any=[],block=[]){rules.push({careerId,questionId:careerId+(suffix.startsWith('-')?suffix:'-047-'+suffix),all,any,block,reason});}
for(const n of[1,2])rule('industrial-design','-interest-044-'+n,n===1?['f:physical-product','m:design','m:making']:['f:physical-prototype','m:design','m:making','m:testing'],'A specific useful-object and physical-prototype context is required; general visual creativity alone cannot establish product design.');
rule('librarian','-interest-044-1',['f:reference-help','f:source-comparison','m:organization'], 'Reference help and explicit source comparison support the information-search interest; organizing appointments alone does not.');
rule('librarian','-interest-044-2',['f:reference-help','m:organization','m:precision'],'Helping someone access reference resources plus explicit organization and accuracy supports resource guidance.');
rule('film-editing','-interest-044-1',['f:shots-edit','m:expression'],'A concrete filmed sequence/editing context is required. A disjunctive story/photo/film option cannot supply it.');
rule('film-editing','-interest-044-2',['f:shots-edit','m:precision'],'The frozen footage/edit fact includes revising timing; precision remains separately required.');
rule('degree-15125100','domain',['f:code-test'],'The specific program-writing/debugging context can support a previously unasked coding-subject question, not a general technology rating.');
rule('degree-15125300','domain',['f:code-test','m:testing'],'Explicit program-test context and deliberate testing support software-failure exploration.');
rule('degree-15125300','responsibility',['f:code-test','m:precision','m:organization','m:explaining'],'Defect documentation requires careful records and communication in addition to testing.');
rule('degree-13112100','domain',['t:enterprise','m:coordination','m:organization'],'An organized event is not necessarily a performing-arts activity. Initiative, coordination and organization remain required.');
rule('degree-13112100','method',['t:enterprise','m:coordination','m:organization'], 'Venue/supplier coordination uses explicit organizational and logistics evidence; performing-arts interest is not a prerequisite.',[['t:logistics','t:finance']]);
rule('degree-13112100','responsibility',['f:financial-reconciliation','m:coordination','m:organization','m:precision'],'Bills and supplier commitments need concrete financial-record and follow-through evidence; social-event enthusiasm is insufficient.');
for(const suffix of['domain','method','responsibility'])rule('degree-19201200',suffix,['f:physical-model','m:quantitative','m:testing','r:research',...(suffix==='responsibility'?['m:precision','m:explaining']:[])],'Motion/measurement comparisons can ground physical-science exploration without sky watching. Numerical modelling, repeatable testing and explicit research interest remain necessary; reporting also needs accuracy and explanation.');
rule('degree-17102100','method',['f:maps-water','m:quantitative','m:precision'],'Existing map/observation records can support mapping analysis without mandatory outdoor collection; numerical and accuracy preferences remain.',[['m:fieldwork','m:computing']]);
export const mappingRules071=rules;

// Neutral activity bank. The same IDs, rules, targeting and four-item limit apply
// to all cohorts. Drafts are occupationally grounded hypotheses, not validated scales.
const bank=[];
function activity(id,domain,careerIds,prompt,text,all,any=[]){bank.push({id:'activity071-'+id,domain,careerIds,prompt,kind:'activity',options:[{id:'activity071-'+id+'-try',text,all,any,block:[]}],alternatives:[{id:'activity071-'+id+'-not-for-me',text:'Not for me'},{id:'activity071-'+id+'-unknown',text:'Not sure / have not tried'}]});}
activity('food-compare','tasks',['food-science'],'Which short food experiment would you choose to try?','Change one ingredient while keeping the steps comparable, then compare what happens to texture or consistency.',['t:food','m:testing']);
activity('food-records','process',['food-science'],'Which part of a food experiment would interest you?','Check the measurements and batch notes carefully before claiming that one version worked better.',['t:food','m:precision','r:research']);
activity('public-message','tasks',['public-relations'],'Which communication activity would you choose?','Explain a project to a particular audience and compare how different messages are understood.',['t:marketing','m:explaining','m:persuading']);
activity('public-accuracy','process',['public-relations'],'What would you like to do before sharing a project update?','Check the details, notice misleading wording, and explain what the evidence actually supports.',['t:marketing','m:precision','m:explaining']);
activity('exercise-measures','tasks',['exercise-physiology'],'Which supervised activity comparison would you choose?','Compare numerical observations before and after a movement routine, using a repeatable procedure.',['t:movement','m:quantitative','m:testing']);
activity('exercise-records','process',['exercise-physiology'],'Which part of a supported exercise introduction interests you?','Keep an accurate record of progress against a care plan and flag a result that needs checking.',['t:movement','m:precision','r:patientcare']);
activity('social-sources','tasks',['social-research'],'Which community-question activity would you choose?','Compare source evidence about how a community rule affects different people.',['t:policy','m:investigation']);
activity('social-records','process',['social-research'],'What would interest you when a community study has incomplete information?','Organize the records, check uncertain details and keep missing information distinct from a conclusion.',['t:policy','m:organization','m:precision']);
for(const[id,topic,fact]of[['mechanism','mechanics','mechanism-test'],['circuit','electronics','circuit-test']]){
 const career=id==='mechanism'?'mechanical-engineering':'electrical-engineering';
 activity(id+'-compare','tasks',[career],'Which small physical-system project would you choose?','Compare a tested change in a '+id+' and check whether it behaves as expected.',['f:'+fact,'m:testing']);
 activity(id+'-record','process',[career],'What would you choose to do after trying a physical design?','Check the design and test notes carefully before explaining which change worked.',['f:'+fact,'m:design','m:precision']);
}
activity('reference-search','tasks',['librarian'],'Which information activity would you choose?','Help someone find useful reference sources, compare their reliability and clarify what is still missing.',['f:reference-help','f:source-comparison']);
activity('reference-access','process',['librarian'],'What would interest you about a shared information collection?','Organize and check its records so another person can find the resource they need.',['t:information','m:organization','m:precision']);
activity('accounts-check','tasks',['accounting'],'Which financial-record activity would you choose?','Reconcile recorded receipts against spending and investigate a total that does not agree.',['t:finance','m:precision','m:investigation']);
activity('accounts-trail','process',['accounting'],'What would interest you after a financial record does not add up?','Organize the evidence trail and check the explanation before filling in any missing information.',['t:finance','m:organization','m:precision']);
activity('audience-evidence','tasks',['market-research'],'Which project question would you choose to investigate?','Compare numerical evidence about how audiences respond to different messages.',['t:marketing','m:quantitative','m:investigation']);
activity('audience-sample','process',['market-research'],'What would interest you about a small survey?','Check whether the sample and the wording could change the conclusion about an audience.',['f:survey-design','m:precision','m:investigation']);
activity('product-model','tasks',['industrial-design'],'Which making activity would you choose?','Sketch a useful physical object and compare designs before building a model.',['f:physical-product','m:design','m:making']);
activity('product-revision','process',['industrial-design'],'What would interest you after building a small physical model?','Test a revised part and check which design trade-off improved how it works.',['f:physical-prototype','m:design','m:testing']);
activity('footage-sequence','tasks',['film-editing'],'Which story-making activity would you choose?','Select and arrange footage from a filmed sequence, then revise the timing to change how it works.',['f:shots-edit','m:expression']);
activity('footage-check','process',['film-editing'],'What would interest you while revising a short recording?','Check picture, sound and timing carefully before deciding the edit is finished.',['f:shots-edit','m:precision']);
activity('investment-compare','tasks',['personal-financial-advisor'],'Which financial introduction would you choose?','Compare uncertain investment returns and the consequences of a recommendation for another person.',['t:investment','m:quantitative','r:risk']);
activity('investment-explain','process',['personal-financial-advisor'],'What would interest you before sharing a financial recommendation?','Check the records and explain uncertainty and limits without promising a return.',['t:finance','m:precision','m:explaining','r:risk']);
export const activityBank071=bank;
export const specialtyQuestions071=[
 {id:'context071-vision',domain:'specialty',careerIds:['degree-29104100'],kind:'context',prompt:'Which supervised health introduction would you choose?',options:[{id:'context071-vision-try',text:'Compare how focusing and vision tests inform an eye examination, including when a finding needs referral.',all:['f:vision-examination'],any:[],block:[]}],alternatives:[{id:'context071-vision-no',text:'A different health topic interests me more'},{id:'context071-vision-unknown',text:'Not sure / have not tried'}]},
 {id:'context071-animal-production',domain:'specialty',careerIds:['degree-19101100'],kind:'context',prompt:'Which animal-related investigation would you choose?',options:[{id:'context071-animal-production-try',text:'Compare feeding, housing or breeding evidence for animals raised on farms.',all:['f:animal-production'],any:[],block:[]}],alternatives:[{id:'context071-animal-production-care',text:'Routine care or behavior observation interests me more'},{id:'context071-animal-production-unknown',text:'Not sure / have not tried'}]}
];
export const evidenceQuestions071=[
 {id:'evidence071-physical-model',domain:'subject',careerIds:['degree-19201200'],kind:'evidence',prompt:'Which physical-science introduction would you choose?',options:[{id:'evidence071-physical-model-try',text:'Compare a prediction about motion with the result of a small experiment.',all:['f:physical-model'],any:[],block:[]}],alternatives:[{id:'evidence071-physical-model-other',text:'Observe a pattern in the night sky instead'},{id:'evidence071-physical-model-unknown',text:'Not sure / have not tried'}]},
 {id:'evidence071-research-report',domain:'responsibility',careerIds:['degree-19201200','degree-19309300'],kind:'evidence',prompt:'Which part of an investigation would you choose to try?',options:[{id:'evidence071-research-report-try',text:'Record the assumptions and uncertainty so someone else can challenge or repeat the reasoning.',all:['r:research','m:precision','m:explaining'],any:[],block:[]}],alternatives:[{id:'evidence071-research-report-result',text:'Focus on finding the result for now'},{id:'evidence071-research-report-unknown',text:'Not sure / have not tried'}]},
 {id:'evidence071-event-commitments',domain:'responsibility',careerIds:['degree-13112100'],kind:'evidence',prompt:'Which part of organizing a group event would you choose?',options:[{id:'evidence071-event-commitments-try',text:'Keep track of agreed costs and supplier commitments, and check what must change when plans change.',all:['f:financial-reconciliation','m:coordination','m:organization','m:precision'],any:[],block:[]}],alternatives:[{id:'evidence071-event-commitments-activities',text:'Choose the activities without managing bills or suppliers'},{id:'evidence071-event-commitments-unknown',text:'Not sure / have not tried'}]},
 {id:'evidence071-safety-accountability',domain:'responsibility',careerIds:['mechanical-engineering','electrical-engineering','degree-17211100'],kind:'evidence',prompt:'Which responsibility would you choose in a supervised technical introduction?',options:[{id:'evidence071-safety-accountability-try',text:'Check safety rules, recognize when the evidence is incomplete and ask for qualified help before proceeding.',all:['r:safety'],any:[],block:[]}],alternatives:[{id:'evidence071-safety-accountability-observe',text:'Observe first before deciding whether to take this responsibility'},{id:'evidence071-safety-accountability-unknown',text:'Not sure / have not tried'}]},
 {id:'evidence071-curriculum-review',domain:'method',careerIds:['degree-25903100'],kind:'evidence',prompt:'Which learning-material project would you choose?',options:[{id:'evidence071-curriculum-review-try',text:'Compare how well two learning guides work and revise the sequence using evidence about understanding.',all:['f:learning-guide','m:design','m:precision'],any:[],block:[]}],alternatives:[{id:'evidence071-curriculum-review-explain',text:'Explain a familiar idea without evaluating a course or curriculum'},{id:'evidence071-curriculum-review-unknown',text:'Not sure / have not tried'}]},
 {id:'evidence071-educator-coaching',domain:'responsibility',careerIds:['degree-25903100'],kind:'evidence',prompt:'Which education responsibility would you choose to explore?',options:[{id:'evidence071-educator-coaching-try',text:'Help educators review teaching evidence and coordinate curriculum changes with them.',all:['f:educator-coaching'],any:[],block:[]}],alternatives:[{id:'evidence071-educator-coaching-learners',text:'Work directly with learners instead'},{id:'evidence071-educator-coaching-unknown',text:'Not sure / have not tried'}]},
 {id:'evidence071-client-budget',domain:'responsibility',careerIds:['degree-13207100'],kind:'evidence',prompt:'Which financial responsibility would you choose to learn about?',options:[{id:'evidence071-client-budget-try',text:'Help another person compare a manageable debt plan and explain consequences without promising an outcome.',all:['f:client-debt-care'],any:[],block:[]}],alternatives:[{id:'evidence071-client-budget-records',text:'Keep records without advising another person'},{id:'evidence071-client-budget-unknown',text:'Not sure / have not tried'}]}
];
export const followupBank071=[...bank,...specialtyQuestions071,...evidenceQuestions071];
export const specialtyGuards071={
 'degree-29104100':{questionId:'context071-vision',feature:'f:vision-examination',reason:'General health and clinical interest do not establish a preference for vision examination.'},
 'degree-19101100':{questionId:'context071-animal-production',feature:'f:animal-production',reason:'Routine animal care does not establish interest in farm-animal nutrition, breeding or production research.'}
};
export function simulate071(q,ledger){const selected=[],refs=[];for(const o of q.options){const d=decide(ledger,o);if(d.response==='yes'){selected.push(o.id);refs.push(...d.evidence);}}
 return{selected,feedback:selected.length?null:'unfamiliar',source:'profile-inferred',confidence:selected.length?'medium':'low',evidence:refs.map(e=>e.feature+': '+e.quote).join(' · ')||'The requested context or method is not stated in frozen typed evidence.',refs};}
export function selectFollowups071(rows,ledger){
 const byId=new Map(rows.map(r=>[r.id,r]));
 const choices=followupBank071.map((q,index)=>{const relevant=q.careerIds.map(id=>byId.get(id)).filter(Boolean).filter(r=>!r.specific.contrary.length);
  const isGuard=q.kind==='context';
  const need=relevant.filter(r=>isGuard?r.specific.specificDomains.length>=2:q.kind==='evidence'?r.specific.specificDomains.length>=1&&r.specific.missing.length>0:r.specific.specificDomains.length>=1&&r.specific.taskDomainCount<2);
  const anchors=q.options.flatMap(o=>o.all).filter(k=>k.startsWith('t:')||k.startsWith('f:'));
  if(!need.length||q.kind==='activity'&&!anchors.some(k=>ledger.yes[k]?.length))return null;
  if(q.options.every(o=>o.all.some(k=>ledger.no[k]?.length)))return null;
  const domains=new Set(need.flatMap(r=>r.specific.taskDomains));
  return{q,index,priority:[Number(isGuard&&need.some(r=>r.specific.supported)),Math.max(...need.map(r=>r.specific.specificDomains.length)),Number(!domains.has(q.domain)),Math.max(...need.map(r=>r.r??-2)),need.length]};
 }).filter(Boolean).sort((a,b)=>{for(let i=0;i<a.priority.length;i++)if(a.priority[i]!==b.priority[i])return b.priority[i]-a.priority[i];return a.index-b.index;});
 // Prefer a second task domain over repeating the same domain for a career.
 const chosen=[],served=new Map();
 while(choices.length&&chosen.length<4){const completion=x=>Number(x.q.kind==='activity'&&x.q.careerIds.some(id=>served.has(id)&&!served.get(id).has(x.q.domain)));choices.sort((a,b)=>completion(b)-completion(a)||Number(a.q.careerIds.some(id=>served.get(id)?.has(a.q.domain)))-Number(b.q.careerIds.some(id=>served.get(id)?.has(b.q.domain))));const item=choices.shift();chosen.push(item.q);for(const id of item.q.careerIds){if(!served.has(id))served.set(id,new Set());served.get(id).add(item.q.domain);}}
 return chosen;
}
export function researchRows071(rows,answers,ledger,states){
 return rows.map(r=>{
  const extra=activityBank071.filter(q=>q.careerIds.includes(r.id)).flatMap(q=>{const a=answers[q.id];return a?.selected?.length&&!a.feedback&&eligible(a)?[{questionId:q.id,prompt:q.prompt,domain:q.domain,text:q.options.filter(o=>a.selected.includes(o.id)).map(o=>o.text).join('; '),kind:'task',source:a.source,confidence:a.confidence,evidence:a.evidence,refs:a.refs}]:[];});
  const domains=[...new Set([...r.specific.taskDomains,...extra.map(e=>e.domain)])],specific={...r.specific,evidence:[...r.specific.evidence,...extra],taskDomains:domains,taskDomainCount:domains.length};
  if(specific.specificDomains.length===2&&r.specific.requirement.startsWith('Two distinct'))specific.supported=!specific.contrary.length&&domains.length>=2&&specific.missing.length===0;
  const guard=specialtyGuards071[r.id];let confirmation=null;
  if(guard){
   const hasFeature=!!ledger.yes[guard.feature]?.length&&!ledger.no[guard.feature]?.length;
   const domainAnswer=states?.[r.id];
   const direct=domainAnswer?.response==='yes'&&domainAnswer.source!=='profile-inferred'&&eligible(domainAnswer);
   const answer=answers[guard.questionId],guardYes=answer?.selected?.includes(guard.questionId+'-try')&&eligible(answer);
   if(!hasFeature&&!direct&&!guardYes){confirmation={...guard,status:'Specific context remains unknown'};specific.supported=false;specific.missing=[...specific.missing,{id:guard.questionId,prompt:followupBank071.find(q=>q.id===guard.questionId).prompt}];}
  }
  return{...r,specific,confirmation071:confirmation};
 });
}
export function supportedOrder071(rows){return rows.filter(r=>r.specific.supported).sort((a,b)=>(b.r??-2)-(a.r??-2)||b.specific.specificDomains.length-a.specific.specificDomains.length||b.specific.taskDomainCount-a.specific.taskDomainCount||a.id.localeCompare(b.id));}
