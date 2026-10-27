import{choose099}from'../evidence-099/targeting.mjs';import{explorerCareerQuestions}from'../../dist/open-explorer-090.js';import{taskEvidenceDomain}from'../../dist/career-check-questions.js';import{completion}from'../evidence-090/targeting.mjs';import{key095}from'../evidence-095/targeting.mjs';
// Preserve the previous allocation when a candidate is one domain from support.
// Alternatives are existing activities; no profile facts or unseen answers enter.
export function choose100(rows,ctx){let base=choose099(rows,{...ctx,questionsFor:explorerCareerQuestions}),near=base&&completion(base.r).positive>=completion(base.r).required-1;
 if(near&&['specific','core-work'].includes(base.q.kind))return base;
 const rescue=[];
 for(const r of rows){if(r.specific.supported||r.specific.contrary.length||r.specific.specificDomains.length<2||r.specific.taskDomains.length>=2)continue;const qs=ctx.questionsFor(r.id),unknown=qs.filter(q=>q.alternate100&&ctx.answerFor(r.id,q)?.response==='unfamiliar').length;if(unknown>=2)continue;
 for(const q of qs){if(!q.alternate100||r.specific.taskDomains.includes(taskEvidenceDomain(q)))continue;const key=key095(r,q),a=ctx.answerFor(r.id,q);if(ctx.seen.has(key)||a||!ctx.canAnswer(q,r.id))continue;rescue.push({r,q,key,unknown});}}
 rescue.sort((a,b)=>b.r.specific.taskDomains.length-a.r.specific.taskDomains.length||a.unknown-b.unknown||(b.r.r??-2)-(a.r.r??-2)||a.key.localeCompare(b.key));if(rescue.length)return rescue[0];
 return base;
}
