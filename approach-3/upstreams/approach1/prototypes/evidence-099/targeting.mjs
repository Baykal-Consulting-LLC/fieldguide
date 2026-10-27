import{taskEvidenceDomain}from'../../dist/career-check-questions.js';
import{completion}from'../evidence-090/targeting.mjs';
import{key095}from'../evidence-095/targeting.mjs';
// Uses only prior observed answers, catalog binding availability and official-score
// rows. Never receives model facts, unseen answers, cohort, salary or education.
export function choose099(rows,{questionsFor,answerFor,seen,canAnswer}){
 const selected=(id,field,option)=>answerFor('',{id,field,options:[]})?.selected?.includes(option);
 const historyBridge=selected('creative-refine-3','creative','creative-refine-3-3');
 const plantBridge=selected('science-refine-3','science','science-refine-3-4')||(selected('science-setting','science','science-setting-3')&&selected('science-wonder','science','science-wonder-4'));
 const graphicBridge=selected('creative-make','creative','creative-make-1');
 const fieldHistory=new Map();
 // Unknown is neither dislike nor absence of interest. It only lowers the value
 // of spending another scarce item in that same field before trying alternatives.
 for(const r of rows)for(const q of questionsFor(r.id))if(q.options&&!['specific','core-work'].includes(q.kind)){
  const a=answerFor(r.id,q);if(!a)continue;let h=fieldHistory.get(q.field);if(!h){h={keys:new Set(),unknown:0,positive:0};fieldHistory.set(q.field,h);}const key=key095(r,q);if(h.keys.has(key))continue;h.keys.add(key);h.unknown+=a.response==='unfamiliar'?1:0;h.positive+=a.selected?.length?1:0;
 }
 const candidates=new Map();
 for(const r of rows){if(r.specific.supported||r.specific.contrary.length)continue;const qs=questionsFor(r.id),required=new Set(r.specific.missing.map(q=>q.id)),c=completion(r),unknowns=qs.filter(q=>['specific','core-work'].includes(q.kind)&&answerFor(r.id,q)?.response==='unfamiliar').length;
 const bridged=r.id==='degree-19309300'&&historyBridge||r.id==='degree-19101300'&&plantBridge||r.id==='graphic-design'&&graphicBridge;
 for(const q of qs){const key=key095(r,q),a=answerFor(r.id,q),specific=['specific','core-work'].includes(q.kind);if(seen.has(key)||a?.reviewHold||a?.selected?.length||['yes','no','unfamiliar'].includes(a?.response)||a?.feedback==='none'||specific&&!required.has(q.id)||!canAnswer(q,r.id))continue;
 if(specific&&!(r.r>=.608||r.activityTopics?.length||r.specific.evidence.length||bridged))continue;
 // One unknown does not reject a career. A bounded alternate can uncover evidence,
 // but repeated unknowns do not consume the student's entire short round.
 if(specific&&(unknowns>=2||unknowns&&c.positive===0))continue;
 if(!specific&&(r.specific.taskDomains.length>=2||r.specific.taskDomains.includes(taskEvidenceDomain(q))))continue;
 const weight=Math.max(.05,(r.r??0)+.4)+(r.directActivity087?.15:0),remaining=Math.max(1,c.required-c.positive),ready=r.specific.specificDomains.length>0||r.specific.taskDomains.length>=2;
 let score=specific?(ready?8+c.fraction*4:1+c.fraction*3)/remaining*(ready?Math.max(1,weight):weight)/(1+unknowns*2):0;
 if(specific&&bridged&&!unknowns&&r.specific.specificDomains.length===0)score=Math.max(score,4+Math.max(0,r.r??0)*.3);
 let item=candidates.get(key);if(!item){item={r,q,key,score,links:new Set(),weight:0,positive:0};candidates.set(key,item);}
 if(!specific&&q.options.some(o=>o.careerIds?.includes(r.id))&&!item.links.has(r.id)){item.links.add(r.id);item.weight+=weight;item.positive=Math.max(item.positive,c.positive);if(weight>Math.max(.05,(item.r.r??0)+.4)+(item.r.directActivity087?.15:0))item.r=r;}
 }}
 for(const item of candidates.values())if(item.links.size){const h=fieldHistory.get(item.q.field)||{unknown:0,positive:0};item.score=(1+Math.log2(1+Math.min(3,item.weight)))*(item.positive>=1?1.6:1)/(1+h.unknown*(h.positive?.25:2));}
 return [...candidates.values()].sort((a,b)=>b.score-a.score||(b.r.r??-2)-(a.r.r??-2)||a.key.localeCompare(b.key))[0]||null;
}
