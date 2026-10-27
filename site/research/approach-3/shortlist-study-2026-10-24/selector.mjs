import fs from 'node:fs';
import {choose100} from '../../site/prototypes/evidence-100/targeting.mjs';
import {completion} from '../../site/prototypes/evidence-090/targeting.mjs';
import {key095} from '../../site/prototypes/evidence-095/targeting.mjs';
import {taskEvidenceDomain} from '../../site/dist/career-check-questions.js';
const info=JSON.parse(fs.readFileSync(new URL('../../site/research/evidence-104/question-information.json',import.meta.url))).questions;
const specific=q=>['specific','core-work'].includes(q.kind);
function answerability(q){const v=info[q.id];return v?.asked>=20?(v.asked-v.unknown+5)/(v.asked+10):.5;}
// One predeclared research candidate. No model facts, unseen answers, salaries,
// education preferences, cohort identities or previous-run outcomes are inputs.
export function chooseA3(rows,ctx){
 const base=choose100(rows,ctx);
 if(base&&specific(base.q)&&completion(base.r).positive>=completion(base.r).required-1)return {...base,reasonA3:'preserve-final-confirmation'};
 const fields=new Map();
 for(const a of ctx.events||[]){if(!a.field)continue;const f=fields.get(a.field)||{unknown:0,positive:0};f.unknown+=a.unknown?1:0;f.positive+=a.selected?.length?1:0;fields.set(a.field,f);}
 const eligible=rows.filter(r=>!r.specific.supported&&!r.specific.contrary.length&&(r.r>=.608||r.activityTopics?.length||r.specific.evidence.length));
 const observed=eligible.filter(r=>r.specific.evidence.length).sort((a,b)=>completion(b).fraction-completion(a).fraction||(b.r??-2)-(a.r??-2)||a.id.localeCompare(b.id));
 const focused=observed.slice(0,6),included=new Set(focused.map(r=>r.id));
 const broad=eligible.filter(r=>!included.has(r.id)).sort((a,b)=>(b.r??-2)-(a.r??-2)||a.id.localeCompare(b.id));
 const fieldSet=new Set(focused.map(r=>r.fields[0]));
 for(const distinct of [true,false])for(const r of broad){if(focused.length>=8)break;if(included.has(r.id)||distinct&&fieldSet.has(r.fields[0]))continue;focused.push(r);included.add(r.id);fieldSet.add(r.fields[0]);}
 const questions=new Map();
 for(const r of focused){
  const c=completion(r),qs=ctx.questionsFor(r.id),missing=new Set(r.specific.missing.map(q=>q.id));
  const unknowns=qs.filter(q=>specific(q)&&ctx.answerFor(r.id,q)?.response==='unfamiliar').length;
  for(const q of qs){
   const key=key095(r,q),old=ctx.answerFor(r.id,q),sp=specific(q);
   if(ctx.seen.has(key)||old||!ctx.canAnswer(q,r.id)||sp&&!missing.has(q.id))continue;
   if(sp&&(unknowns>=2||unknowns&&c.positive===0))continue;
   if(!sp&&(r.specific.taskDomains.length>=2||r.specific.taskDomains.includes(taskEvidenceDomain(q))||!q.options?.some(o=>o.careerIds?.includes(r.id))))continue;
   const positive=r.specific.evidence.length>0,ready=r.specific.specificDomains.length>0||r.specific.taskDomains.length>=2;
   const weight=Math.max(.1,(r.r??0)+.4)+(r.directActivity087?.15:0),remaining=Math.max(1,c.required-c.positive);
   let item=questions.get(key);if(!item){item={r,q,key,score:0,links:new Set(),weight:0,positive:false};questions.set(key,item);}
   if(sp)item.score=(ready?8+c.fraction*4:1+c.fraction*3)/remaining*(ready?Math.max(1,weight):weight)/(1+2*unknowns)*(.5+answerability(q));
   else if(!item.links.has(r.id)){item.links.add(r.id);item.weight+=weight;item.positive||=positive;if(c.fraction>completion(item.r).fraction)item.r=r;}
  }
 }
 for(const item of questions.values())if(item.links.size){const f=fields.get(item.q.field)||{unknown:0,positive:0};item.score=(1+Math.log2(1+Math.min(3,item.weight)))*(item.positive?1.7:1)*(.5+answerability(item.q))/(1+f.unknown*(f.positive?.35:2));}
 const next=[...questions.values()].sort((a,b)=>b.score-a.score||(b.r.r??-2)-(a.r.r??-2)||a.key.localeCompare(b.key))[0];
 return next?{...next,reasonA3:specific(next.q)?'close-interest-gap':'new-activity-context'}:base?{...base,reasonA3:'baseline-fallback'}:null;
}
