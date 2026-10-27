import {choose100} from '../../site/prototypes/evidence-100/targeting.mjs';
import {completion} from '../../site/prototypes/evidence-090/targeting.mjs';
import {key095} from '../../site/prototypes/evidence-095/targeting.mjs';
import {taskEvidenceDomain} from '../../site/dist/career-check-questions.js';

const isSpecific=q=>['specific','core-work'].includes(q.kind);
const isExpanded=r=>!!(r.o.expandedDegree||r.o.noncollege087||r.o.evidence088);

// Research-only scheduling. Never receives profiles, unseen answers, education,
// salaries or cohort identities. Support is always decided by the original engine.
export function createProtectedSelector(control=choose100){
 let active=null,serial=0;
 const paused=new Set(),episodes=[];
 function planFor(r,ctx){
  if(r.specific.supported||r.specific.contrary.length||paused.has(r.id))return null;
  if(r.specific.specificDomains.length<1&&r.specific.taskDomains.length<2)return null;
  const c=completion(r),qs=ctx.questionsFor(r.id),missing=new Set(r.specific.missing.map(q=>q.id));
  if(qs.some(q=>isSpecific(q)&&ctx.answerFor(r.id,q)?.response==='unfamiliar'))return null;
  const pending=qs.filter(q=>isSpecific(q)&&missing.has(q.id)&&!ctx.seen.has(key095(r,q))&&!ctx.answerFor(r.id,q)&&ctx.canAnswer(q,r.id));
  // Every outstanding defining-interest item must be available; never complete a
  // partial set while pretending unavailable/unknown interests have been resolved.
  if(pending.length!==missing.size)return null;
  const plan=[...pending],domains=new Set(r.specific.taskDomains);
  if(!isExpanded(r)){
   const tasks=qs.filter(q=>!isSpecific(q)&&q.options?.some(o=>o.careerIds?.includes(r.id))&&!domains.has(taskEvidenceDomain(q))&&!ctx.seen.has(key095(r,q))&&!ctx.answerFor(r.id,q)&&ctx.canAnswer(q,r.id));
   // Canonical bank order, distinct evidence contexts, no answerability lookup.
   for(const q of tasks){if(domains.size>=2)break;const d=taskEvidenceDomain(q);if(domains.has(d))continue;domains.add(d);plan.push(q);}
   if(domains.size<2)return null;
  }
  if(!plan.length||plan.length>3||plan.length>ctx.remaining)return null;
  return {r,plan,fraction:c.fraction};
 }
 function close(reason){if(active){active.log.end=reason;active=null;}}
 function choose(rows,ctx){
  if(active){
   const r=rows.find(r=>r.id===active.id),last=ctx.events.at(-1);
   if(!r||r.specific.supported)close(r?'confirmed':'unavailable');
   else if(r.specific.contrary.length||last?.unknown||last?.response==='no'||completion(r).positive<=active.previous){paused.add(active.id);close('no-new-positive-evidence');}
   else {
    const pending=active.plan.filter(q=>!ctx.seen.has(key095(r,q))&&!ctx.answerFor(r.id,q));
    if(!pending.length)close('set-finished-without-support');
    else if(pending.length>ctx.remaining)close('insufficient-budget');
    else {
     const q=pending[0];active.previous=completion(r).positive;active.log.asked.push(q.id);
     return {r,q,key:key095(r,q),reasonA3:'protected-set-continue',bundle:active.log.number};
    }
   }
  }
  const base=control(rows,ctx);
  // Preserve the control's final confirmation before opening another set.
  if(base&&isSpecific(base.q)&&completion(base.r).positive>=completion(base.r).required-1)return {...base,reasonA3:'control-final-confirmation'};
  const plans=rows.map(r=>planFor(r,ctx)).filter(Boolean).sort((a,b)=>b.fraction-a.fraction||a.plan.length-b.plan.length||(b.r.r??-2)-(a.r.r??-2)||a.r.id.localeCompare(b.r.id));
  const next=plans[0];
  if(!next)return base?{...base,reasonA3:'current-control-discovery'}:null;
  const q=next.plan[0],log={number:++serial,careerId:next.r.id,start:ctx.events.length,planned:next.plan.map(q=>q.id),asked:[q.id],existingTasks:next.r.specific.taskDomains.length,existingInterests:next.r.specific.specificDomains.length,end:null};
  episodes.push(log);active={id:next.r.id,plan:next.plan,previous:completion(next.r).positive,log};
  return {r:next.r,q,key:key095(next.r,q),reasonA3:'protected-set-start',bundle:log.number};
 }
 return {choose,episodes,finish(rows){if(active){const r=rows.find(r=>r.id===active.id);close(r?.specific.supported?'confirmed':r?.specific.contrary.length?'contrary': 'budget-ended');}}};
}
