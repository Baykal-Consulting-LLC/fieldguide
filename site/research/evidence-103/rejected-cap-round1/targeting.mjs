import{choose100}from'../evidence-100/targeting.mjs';import{opening102}from'../evidence-102/opening.mjs';import{key095}from'../evidence-095/targeting.mjs';
export const variants103=['fixed','hybrid2','hybrid3'];
export function strongLead103(rows,queue,official){const r=rows.find(r=>r.id===queue[0]?.careerId);return !!r?.directActivity087&&r.activityTopics?.some(id=>Number(official?.[id])>=4);}
// Read only observed responses and static question links. A positive distinctive
// check protects completion; repeated unknowns defer unconfirmed branches.
export function choose103(rows,ctx,mode){if(mode==='fixed')return choose100(rows,ctx);const cap=mode==='hybrid2'?2:3,history=new Map(),seen=new Set();for(const r of rows)for(const q of ctx.questionsFor(r.id)){const a=ctx.answerFor(r.id,q),key=key095(r,q);if(!a||seen.has(key))continue;seen.add(key);const f=q.field||r.fields[0];if(a.response==='unfamiliar')history.set(f,(history.get(f)||0)+1);}
 const filtered=id=>{const r=rows.find(r=>r.id===id);return ctx.questionsFor(id).filter(q=>r.specific.specificDomains.length>0||(history.get(q.field||r.fields[0])||0)<cap);};
 const next=choose100(rows,{...ctx,questionsFor:filtered});if(next&&filtered(next.r.id).some(q=>q.id===next.q.id))return next;
 // choose100's base uses its canonical bank. Restrict rows as well so its
 // completion priorities cannot silently bypass the unknown-field cap.
 const active=rows.filter(r=>r.specific.specificDomains.length>0||(history.get(ctx.questionsFor(r.id)[0]?.field||r.fields[0])||0)<cap);return choose100(active,{...ctx,questionsFor:filtered});}
export{opening102};
