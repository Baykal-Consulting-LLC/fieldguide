import fs from 'node:fs';
import {choose100} from '../evidence-100/targeting.mjs';
import {key095} from '../evidence-095/targeting.mjs';
import {taskEvidenceDomain} from '../../dist/career-check-questions.js';
export const variants104=['fixed','local','relevant'];
const information=JSON.parse(fs.readFileSync(new URL('../../research/evidence-104/question-information.json',import.meta.url))).questions;
const specific=q=>['specific','core-work'].includes(q.kind);
const rate=q=>{const s=information[q.id];return s?.asked>=20?(s.unknown+5)/(s.asked+10):null;};
// Only replace an activity slot. Never replace a specific/final confirmation or
// the initial lead block. Rates use development observations only, not a model's
// unasked answers. A lower unknown rate does not establish an interest.
export function choose104(rows,ctx,mode='fixed'){
 const base=choose100(rows,ctx);if(mode==='fixed'||!base||specific(base.q))return base;
 const oldRate=rate(base.q);if(oldRate===null||oldRate<.60)return base;
 const candidates=new Map();
 for(const r of rows){
  if(r.specific.supported||r.specific.contrary.length||r.specific.taskDomains.length>=2||!(r.r>=.608||r.activityTopics?.length||r.specific.specificDomains.length))continue;
  for(const q of ctx.questionsFor(r.id)){
   const key=key095(r,q),p=rate(q);
   if(!q.options||specific(q)||ctx.seen.has(key)||ctx.answerFor(r.id,q)||!ctx.canAnswer(q,r.id)||r.specific.taskDomains.includes(taskEvidenceDomain(q))||p===null||p>oldRate-.15||(mode==='local'&&q.field!==base.q.field)||!q.options.some(o=>o.careerIds?.includes(r.id)))continue;
   const observed=r.specific.specificDomains.length>0||r.specific.taskDomains.length>0;
   // A cross-field replacement needs already-observed evidence or an official
   // activity lead; population availability alone is not a reason to route there.
   if(mode==='relevant'&&q.field!==base.q.field&&!observed&&!r.directActivity087)continue;
   const weight=Math.max(.05,(r.r??0)+.4)+(r.directActivity087?.15:0)+(observed?.5:0);
   let item=candidates.get(key);if(!item){item={r,q,key,weight:0,links:new Set(),p,observed:false};candidates.set(key,item);}
   if(!item.links.has(r.id)){item.links.add(r.id);item.weight+=weight;item.observed||=observed;if(weight>Math.max(.05,(item.r.r??0)+.4))item.r=r;}
  }
 }
 const ranked=[...candidates.values()].map(x=>({...x,score:(1-x.p)*(1+Math.log2(1+Math.min(3,x.weight)))*(x.observed?1.25:1)})).sort((a,b)=>b.score-a.score||(b.r.r??-2)-(a.r.r??-2)||a.key.localeCompare(b.key));
 const next=ranked[0];return next?{...next,replacement104:{from:base.q.id,fromCareer:base.r.id,fromRate:oldRate,toRate:next.p,mode}}:base;
}
