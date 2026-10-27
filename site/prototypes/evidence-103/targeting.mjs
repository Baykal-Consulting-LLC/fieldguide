import{choose100}from'../evidence-100/targeting.mjs';import{opening102}from'../evidence-102/opening.mjs';
export const variants103=['fixed','hybrid2','hybrid3'];
export function strongLead103(rows,queue,official){const r=rows.find(r=>r.id===queue[0]?.careerId);return !!r?.directActivity087&&r.activityTopics?.some(id=>Number(official?.[id])>=4);}
// A bounded detour, never a field rejection. Selection sees only already-observed
// answers, existing question links and official interest evidence.
export function choose103(rows,ctx,mode){const next=choose100(rows,ctx);if(mode==='fixed'||!next||next.r.specific.specificDomains.length>0)return next;const cap=mode==='hybrid2'?2:3,recent=(ctx.events||[]).slice(-cap);if(recent.length<cap||recent.some(a=>!a.unknown))return next;
 const fieldOf=a=>ctx.questionsFor(a.careerId).find(q=>q.id===a.id)?.field||rows.find(r=>r.id===a.careerId)?.fields[0],field=fieldOf(recent[0]);if(!field||recent.some(a=>fieldOf(a)!==field)||(next.q.field||next.r.fields[0])!==field)return next;
 const detour=opening102(rows,ctx,new Set([field]));return detour||next;}
export{opening102};
