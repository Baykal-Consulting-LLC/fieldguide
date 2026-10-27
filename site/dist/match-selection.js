import {educationRoutesFor} from './education-routes.js';
export function educationPreferenceScore(o,preferences=[]){
 if(!o||!preferences.length||preferences.includes('unknown'))return 0;
 const keys=educationRoutesFor(o).map(r=>r.key);
 return Number(preferences.some(p=>p==='graduate'?keys.includes('graduate'):p==='college'?keys.includes('college'):p==='training'?keys.some(k=>['work','program','apprenticeship'].includes(k)):false));
}
export const taskEvidenceShare=r=>(r.score||0)/(r.taskTotal||8);
// Independent supporting question groups measure evidence breadth; unasked work stays unknown.
// Preferences and first-paid-stage pay rank only careers with comparable work
// evidence and whole-profile alignment. They never establish eligibility.
export function selectTopPlanMatches(rows,limit=3,{education=[]}={}){
 if(rows.some(r=>r.expandedDegree)){
  const grade=r=>{const q=r.confirmation?.questions||[];return q.length?Math.min(...q.map(q=>q.answer?.source==='profile-inferred'?(q.answer.confidence==='high'?3:2):3)):0;};
  const ranked=[...rows].sort((a,b)=>grade(b)-grade(a)||(b.interestMatch?.tier||0)-(a.interestMatch?.tier||0)||(b.interestMatch?.r??-2)-(a.interestMatch?.r??-2)||String(a.id).localeCompare(String(b.id))),top=[];
  const degree=r=>educationRoutesFor(r.o).some(x=>['college','graduate'].includes(x.key));
  const pay=r=>r.opportunity?.requiresExperience?0:r.opportunity?.firstPay??0;
  const strongest=ranked[0];
  while(ranked.length&&top.length<limit){
   const lead=ranked[0],close=ranked.filter(r=>grade(r)===grade(lead)&&(r.interestMatch?.tier||0)===(lead.interestMatch?.tier||0)&&(r.interestMatch?.r??-2)>=(lead.interestMatch?.r??-2)-.1);
   close.sort((a,b)=>educationPreferenceScore(b.o,education)-educationPreferenceScore(a.o,education)||Number(b.meetsLifestyle)-Number(a.meetsLifestyle)||pay(b)-pay(a)||(b.interestMatch?.r??-2)-(a.interestMatch?.r??-2)||String(a.id).localeCompare(String(b.id)));
   for(const r of close){if(top.length===limit)break;top.push(r);}for(const r of close)ranked.splice(ranked.indexOf(r),1);
  }
  // A comparable college option can accompany a strong lower-paying noncollege fit.
  // Keep that original interest leader when affordability changes the order.
  if(limit>1&&strongest&&!degree(strongest)&&!strongest.meetsLifestyle&&!top.includes(strongest)&&top.some(r=>degree(r)&&r.meetsLifestyle))top[top.length-1]=strongest;
  return top;
 }
 const strength=r=>r.answeredTasks!==undefined&&!r.historicalEvidence?(r.score||0):taskEvidenceShare(r);
 const pending=[...rows].sort((a,b)=>(b.specificSupport||0)-(a.specificSupport||0)||Number(b.routeSupport)-Number(a.routeSupport)||strength(b)-strength(a)||(b.interestMatch?.r??-2)-(a.interestMatch?.r??-2)),top=[];
 const pay=r=>r.opportunity?.requiresExperience||r.requiresExperience?0:r.opportunity?.firstPay??r.firstPay??0;
 while(pending.length&&top.length<limit){
  const lead=pending[0],close=pending.filter(r=>r.specificSupport===lead.specificSupport&&r.routeSupport===lead.routeSupport&&strength(r)>=strength(lead)-(lead.answeredTasks!==undefined&&!lead.historicalEvidence?1:.125)&&r.basis===lead.basis&&(r.basis!=='profile-and-tasks'||Math.abs((r.interestMatch?.r??0)-(lead.interestMatch?.r??0))<=.1));
  close.sort((a,b)=>educationPreferenceScore(b.o,education)-educationPreferenceScore(a.o,education)||Number(b.meetsLifestyle)-Number(a.meetsLifestyle)||pay(b)-pay(a)||pending.indexOf(a)-pending.indexOf(b));
  for(const r of close){if(top.length===limit)break;top.push(r);}for(const r of close)pending.splice(pending.indexOf(r),1);
 }
 return top;
}
