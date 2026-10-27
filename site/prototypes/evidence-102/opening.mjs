import{choose095}from'../evidence-095/targeting.mjs';
export const variants102=['current','activity1','activity3'];
export const openingCount102=mode=>mode==='activity3'?3:mode==='activity1'?1:0;
// Only observed state, existing question links and static simulator capability.
// One activity per field in this opening; no profile, future answer or outcome access.
export function opening102(rows,ctx,fields){return choose095(rows,{...ctx,questionsFor:id=>ctx.questionsFor(id).filter(q=>q.options&&!['specific','core-work'].includes(q.kind)&&!fields.has(q.field)&&ctx.canAnswer(q,id))});}
