import{explorerCareerQuestions,explorerAnswer}from'./open-explorer.js';
import{educationRoutesFor}from'./education-routes.js';
import{explorerBudget}from'./explorer-053-budget.js';
// A separate evidence-gathering lane. Never alters answers, matching scores or Top support.
const eligible=a=>!!a&&!a.reviewHold&&(a.source!=='profile-inferred'||(['medium','high'].includes(a.confidence)&&!!a.evidence?.trim()));
const answer=(s,id,q)=>explorerAnswer(s,'profession',id,q);
export function followupRows062(s,result){
 return result.rows.flatMap(r=>{
  if(r.specific.supported||r.specific.contrary.length)return[];
  const qs=explorerCareerQuestions(r.id),checks=qs.filter(q=>['specific','core-work'].includes(q.kind));
  if(checks.some(q=>answer(s,r.id,q)?.reviewHold||answer(s,r.id,q)?.response==='no'))return[];
  const positive=checks.filter(q=>eligible(answer(s,r.id,q))&&answer(s,r.id,q).response==='yes');
  const missing=checks.filter(q=>!positive.includes(q));
  const specific=checks.length===3&&positive.length===2&&missing.length===1;
  const activity=checks.length===2&&positive.length===2&&r.specific.taskDomainCount<2;
  if(!specific&&!activity)return[];
  const targets=specific?missing:qs.filter(q=>!checks.includes(q)&&!r.specific.evidence.some(e=>e.questionId===q.id));
  if(!targets.length)return[];
  return[{...r,followup062:{kind:specific?'specific-check':'activity-context',positiveChecks:positive.length,questions:targets.map(q=>({id:q.id,prompt:q.prompt,index:qs.indexOf(q)})),broadDisagreement:Number.isFinite(r.r)&&r.r<0}}];
 }).sort((a,b)=>Number(b.followup062.kind==='specific-check')-Number(a.followup062.kind==='specific-check')||(b.r??-2)-(a.r??-2)||a.id.localeCompare(b.id));
}
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n):'Unassessed';
export function followupPanel062(s,result,scope='all'){
 const rows=followupRows062(s,result);if(!rows.length)return'';
 return `<section class="guide-input-panel" id="specific-followups"><h2>Specific interests worth a closer look</h2><p>Two specific interests already connect with each of these careers. One specific question or more activity examples remain unresolved. These are optional follow-ups, not supported Top matches. You can answer “not for me,” “unsure,” or “need an example.”</p><details><summary>Compare ${rows.length} careers and the next question</summary><div style="overflow-x:auto"><table><thead><tr><th>Profession</th><th>Evidence still needed</th><th>Learning routes</th><th>First-paid-stage / proxy</th><th>Next question</th></tr></thead><tbody>${rows.map(r=>{const f=r.followup062,b=explorerBudget(s,r.o);return `<tr><td><a href="#/journey/profession/${h(r.id)}">${h(r.o.title)}</a></td><td>2 supported specific interests · ${f.kind==='specific-check'?'1 specific check unresolved':'activity examples unresolved'}${r.r===null?' · broad correlation unavailable':` · broad r ${r.r.toFixed(3)}`}${f.broadDisagreement?' · broad interests point elsewhere':''}</td><td>${educationRoutesFor(r.o).map(x=>h(x.label||x.key)).join(' · ')}</td><td>${money(b.amount)}<br><small>${h(b.reason)}</small></td><td>${f.questions.map(q=>`<a href="#/journey/clarify/${h(r.id)}/${q.index}?scope=${h(scope)}">${h(q.prompt)}</a>`).join('<br>')}</td></tr>`;}).join('')}</tbody></table></div></details><p><small>Specific interests and broad correlations can disagree. All education levels stay available; pay does not change interest fit. Unknown preferences remain unknown until answered.</small></p></section>`;
}
