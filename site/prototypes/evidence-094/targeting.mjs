import{choose093}from'../evidence-093/targeting.mjs';
export function initialLead094(queue){const id=queue[0]?.careerId;return queue.filter(q=>q.careerId===id).slice(0,5);}
// Unfamiliar is not a rejection. Defer that career for this short round rather
// than spending its remaining questions on a responsibility the student cannot assess.
export function choose094(rows,context){const ready=rows.filter(r=>!context.questionsFor(r.id).some(q=>['specific','core-work'].includes(q.kind)&&context.answerFor(r.id,q)?.response==='unfamiliar'));return choose093(ready,{...context,limit:1});}
