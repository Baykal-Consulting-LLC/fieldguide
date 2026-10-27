import{choose100}from'../evidence-100/targeting.mjs';import{completion}from'../evidence-090/targeting.mjs';import{key095}from'../evidence-095/targeting.mjs';import{taskEvidenceDomain}from'../../dist/career-check-questions.js';
// Research only. These policies inspect observed answers and current evidence,
// never profile facts, unseen responses, identity, cohort, salary or education.
export const variants101=['early','finish','balanced'];
const specific=q=>['specific','core-work'].includes(q.kind);
export function choose101(rows,ctx,mode='balanced'){
 const base=choose100(rows,ctx);if(!base)return base;
 const observed=q=>ctx.answerFor('',q),eligible=(r,q)=>!ctx.seen.has(key095(r,q))&&!ctx.answerFor(r.id,q)&&ctx.canAnswer(q,r.id);
 // Preserve the existing final confirming check. Unknown is never a rejection.
 if(specific(base.q)&&completion(base.r).positive>=completion(base.r).required-1)return base;
 const candidates=[];
 for(const r of rows){if(r.specific.supported||r.specific.contrary.length)continue;const qs=ctx.questionsFor(r.id),c=completion(r),remaining=c.required-c.positive,known=r.specific.specificDomains.length,field=qs.filter(q=>q.options&&!specific(q));
 const linked=field.filter(q=>q.options.some(o=>o.careerIds?.includes(r.id)&&observed(q)?.selected?.includes(o.id)));
 const unknown=qs.filter(q=>specific(q)&&ctx.answerFor(r.id,q)?.response==='unfamiliar').length;
 if(unknown)continue;
 for(const q of qs){if(!eligible(r,q))continue;
 const defining=specific(q)&&r.specific.missing.some(m=>m.id===q.id),task=!specific(q)&&!r.specific.taskDomains.includes(taskEvidenceDomain(q));
 // Finish uses already confirmed profession evidence, not a broad-field label.
 if(mode!=='early'&&known>=1&&remaining<=2&&(defining||task))candidates.push({r,q,key:key095(r,q),score:20+c.fraction*4+(r.r??0)});
 // Early asks the first linked profession check after a selected activity. One
 // unknown stops this branch for that career; it grants no support itself.
 if(mode!=='finish'&&defining&&linked.length&&known===0&&ctx.seen.size>=3)candidates.push({r,q,key:key095(r,q),score:5+linked.length+(r.r??0)});
 }}
 // Finishing takes precedence. Early probes replace generic discovery only;
 // they never displace an existing profession-specific question.
 const filtered=candidates.filter(x=>x.score>=20||!specific(base.q));filtered.sort((a,b)=>b.score-a.score||a.key.localeCompare(b.key));return filtered[0]||base;
}
