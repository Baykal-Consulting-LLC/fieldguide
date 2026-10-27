import{beginAutomaticFollowups083,automaticQuestion083,saveAutomaticAnswer083}from'./automatic-followups-083.js';
import{discoveryTopics056}from'./open-explorer-056.js';
import {onetQuestions} from './onet-assessment.js';
import {saveProfileAnswer,skillQuestions,lifestyleComplete} from './profile-journey.js';
import {explorerQuestions} from './explorer-053-questions.js';
import {explorerFieldQuestions,explorerCareerQuestions,resolveExplorerRoute} from './open-explorer-056.js';
import {saveExplorerAnswer} from './explorer-053-state.js';
import {occupationById} from './occupation-data.js';
import {selectCareer,createPlanActions} from './guide-state.js';
export const explorerActions=new Set(['explorer-official','explorer-save','explorer-plan','explorer-response','explorer-task','explorer-skill','explorer-topics056','explorer-auto-begin','explorer-auto-response','explorer-auto-task']);
export function chooseExplorerCareer(s,id){if(!occupationById(id)||!selectCareer(s,id))return false;createPlanActions(s);return true;}
export function explorerFilterRoute(form){const v=new URLSearchParams();for(const k of ['scope','education','sort','q','saved']){const e=form.elements.namedItem(k);if(e&&(e.type!=='checkbox'||e.checked)&&e.value)v.set(k,e.value);}return'journey/explore?'+v;}
export function handleExplorerAction(s,el,{route,go,render,persist=()=>{},root=document}={}){const a=el.dataset.action,id=el.dataset.id;
 if(a==='journey-begin'){s.profileJourney.started=true;const next=!lifestyleComplete(s)?'journey/lifestyle':Object.keys(s.profileJourney.officialInterest?.answers||{}).length===60?beginAutomaticFollowups083(s):'journey/interest-intro';persist();go(next);return true;}
 if(a==='journey-family'){go('journey/explore?scope='+id);return true;}
 if(!explorerActions.has(a)&&!['journey-plan','guide-use-career'].includes(a))return false;
 if(a==='explorer-topics056'){const selected=new Set([...root.querySelectorAll('input[name="topic056"]:checked')].map(e=>e.value));for(const t of discoveryTopics056)saveExplorerAnswer(s,{kind:'facet',questionId:'topic056-'+t.id,payload:{value:selected.has(t.id)?5:3,source:'student',confidence:'high',evidence:'Own optional activity preference; discovery only.'}});persist();render();return true;}
 if(a==='explorer-save'){if(!occupationById(id))return true;s.careerLibrary??={saved:[],notes:{}};const list=s.careerLibrary.saved;s.careerLibrary.saved=list.includes(id)?list.filter(x=>x!==id):[...list,id];persist();render();return true;}
 if(['explorer-plan','journey-plan','guide-use-career'].includes(a)){if(chooseExplorerCareer(s,id)){persist();go('plan');}return true;}
 if(a==='explorer-official'){const i=Number(el.dataset.index),q=onetQuestions[i];if(route().split('?')[0]!=='journey/interest/'+i||q?.id!==el.dataset.question)return true;if(saveProfileAnswer(s,{...q,kind:'interest'},Number(el.dataset.value))){const next=i<59?'journey/interest/'+(i+1):beginAutomaticFollowups083(s);persist();go(next);}return true;}
 if(a==='explorer-auto-begin'){const next=beginAutomaticFollowups083(s);persist();go(next);return true;}
 if(a==='explorer-auto-response'||a==='explorer-auto-task'){const index=Number(el.dataset.index),entry=automaticQuestion083(s,index);if(!entry||route().split('?')[0]!=='journey/match-followup/'+index||entry.q.id!==el.dataset.question)return true;let payload;if(a==='explorer-auto-response'){if(!['yes','no','unsure','unfamiliar'].includes(el.dataset.value))return true;payload={response:el.dataset.value};}else{const feedback=el.dataset.feedback,selected=[...root.querySelectorAll('input[name="automatic-option"]:checked')].map(e=>e.value).filter(id=>entry.q.options?.some(o=>o.id===id));if(feedback&&!['none','unsure','unfamiliar'].includes(feedback))return true;if(!feedback&&!selected.length){const error=root.querySelector('#automatic-followup-error');if(error)error.textContent='Choose examples, None appeal, Unsure or I need to learn more.';return true;}payload={selected:feedback?[]:selected,...(feedback?{feedback}:{})};}const next=saveAutomaticAnswer083(s,index,payload);if(next){persist();go(next);}return true;}
 if(a==='explorer-skill'){const i=Number(el.dataset.index),q=skillQuestions[i];if(route()!=='journey/strengths/'+i||q?.id!==id)return true;if(saveProfileAnswer(s,{...q,kind:'skill'},el.dataset.value)){persist();go(i+1<skillQuestions.length?'journey/strengths/'+(i+1):'journey/explore');}return true;}
 const {kind,scope,question:questionId}=el.dataset,i=Number(el.dataset.index),qs=kind==='facet'?explorerQuestions:kind==='field'?explorerFieldQuestions(scope):kind==='profession'?explorerCareerQuestions(scope):[],q=qs[i],prefix=kind==='facet'?'journey/refine':kind==='field'?'journey/field-survey/'+scope:'journey/clarify/'+scope;
 if(!q||q.id!==questionId||route().split('?')[0]!==prefix+'/'+i)return true;
 let payload;
 if(a==='explorer-task'){const feedback=el.dataset.feedback,selected=[...root.querySelectorAll('#explorer-answer input[name="explorer-option"]:checked')].map(e=>e.value).filter(v=>q.options?.some(o=>o.id===v));if(!feedback&&!selected.length){const error=root.querySelector('#explorer-error');if(error)error.textContent='Choose an example, None appeal, Unsure or I need to learn more.';return true;}if(feedback&&!['none','unsure','unfamiliar'].includes(feedback))return true;payload={selected:feedback?[]:selected,...(feedback?{feedback}:{})};}
 else if(kind==='facet'){const v=el.dataset.value,value=/^[1-5]$/.test(v)?Number(v):v;if(![1,2,3,4,5,'unfamiliar'].includes(value))return true;payload={value};}
 else{if(!['yes','no','unsure','unfamiliar'].includes(el.dataset.value))return true;payload={response:el.dataset.value};}
 saveExplorerAnswer(s,{kind,scope,questionId,payload});persist();const next=i+1,ret=kind==='field'?scope:el.dataset.return||'all';go(next<qs.length&&(kind!=='facet'||next%8!==0)?prefix+'/'+next+'?scope='+ret:'journey/explore?scope='+ret+(kind==='facet'?'&round='+next:''));return true;
}
