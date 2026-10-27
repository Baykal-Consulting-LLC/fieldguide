import{choose100}from'../evidence-100/targeting.mjs';import{completion}from'../evidence-090/targeting.mjs';import{key095}from'../evidence-095/targeting.mjs';import{taskEvidenceDomain}from'../../dist/career-check-questions.js';
// Research only: observed answers, current evidence and static binding availability.
// No profile facts, future answers, student identity, pay or education enter.
export const variants101=['context','context-finish','finish'];
const specific=q=>['specific','core-work'].includes(q.kind);
export function choose101(rows,ctx,mode='context'){
 const base=choose100(rows,ctx);if(!base)return base;
 if(specific(base.q)||completion(base.r).positive>=completion(base.r).required-1)return base;
 const completeFields=new Set(rows.filter(r=>r.specific.taskDomains.length>=2&&!r.specific.contrary.length).flatMap(r=>ctx.questionsFor(r.id).filter(q=>q.options&&!specific(q)).map(q=>q.field)));
 const eligible=(r,q)=>!ctx.seen.has(key095(r,q))&&!ctx.answerFor(r.id,q)&&ctx.canAnswer(q,r.id),candidates=[];
 for(const r of rows){if(r.specific.supported||r.specific.contrary.length)continue;const qs=ctx.questionsFor(r.id),c=completion(r),remaining=c.required-c.positive,known=r.specific.specificDomains.length;
 // Do not spend an extra context item when a required check cannot be asked.
 if(r.specific.missing.some(q=>!ctx.answerFor(r.id,q)&&!ctx.canAnswer(q,r.id)))continue;
 const unknown=qs.filter(q=>specific(q)&&ctx.answerFor(r.id,q)?.response==='unfamiliar').length;if(unknown)continue;
 for(const q of qs){if(!eligible(r,q))continue;const defining=specific(q)&&r.specific.missing.some(m=>m.id===q.id),task=!specific(q)&&!r.specific.taskDomains.includes(taskEvidenceDomain(q));
 if(mode!=='context'&&known>=1&&remaining<=2&&remaining<=24-ctx.seen.size&&(defining||task))candidates.push({r,q,key:key095(r,q),score:20+c.fraction*4+(r.r??0)});
 if(mode==='finish'||completeFields.has(q.field)||r.specific.taskDomains.length>=2||!q.alternate100||!task||taskEvidenceDomain(q)!=='context'||remaining>24-ctx.seen.size)continue;
 const field=qs.filter(x=>x.options&&!specific(x)&&x.field===q.field),positive=field.some(x=>x.options.some(o=>o.careerIds?.includes(r.id)&&ctx.answerFor(r.id,x)?.selected?.includes(o.id))),unknownField=field.some(x=>ctx.answerFor(r.id,x)?.response==='unfamiliar'),triedExtra=field.some(x=>x.alternate100&&ctx.answerFor(r.id,x));
 if(positive&&unknownField&&!triedExtra)candidates.push({r,q,key:key095(r,q),score:6+(r.r??0)});
 }}
 candidates.sort((a,b)=>b.score-a.score||a.key.localeCompare(b.key));return candidates[0]||base;
}
