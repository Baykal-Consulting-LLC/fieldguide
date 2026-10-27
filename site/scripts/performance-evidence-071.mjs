import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const degree=ps=>ps.some(p=>p.routes.some(r=>['college','graduate'].includes(r.key)));
export function evidenceQueries071(runId){
 const d=JSON.parse(gunzipSync(fs.readFileSync('dist/developer/evidence-benchmark-071.json.gz')));assert.equal(d.baselineRunId,runId);
 const source={label:'Evidence and targeted follow-up fixes · frozen research comparison',executedAt:new Date().toISOString(),files:['research/evidence-071/freeze-001.json','research/evidence-071/results.json.gz','prototypes/evidence-071/engine.mjs','prototypes/evidence-071/authored-contexts.mjs'],definitions:[...d.limitations,'Paired current-system, previous 0.69 and proposed 0.71 results for the same 1,000 models. Strict specialty confirmation is included in proposed counts. Top remains capped at three.']};
 return {
  evidence_models071:{source,rows:d.rows.map(r=>({id:r.id,name:r.name,cohort:r.cohort,source:r.source,...Object.fromEntries(['before','prior','after'].flatMap(a=>[[a+'Top',!!r[a+'Top'].length],[a+'Degree',degree(r[a+'Top'])],[a+'Graduate',r[a+'Top'].some(p=>p.routes.some(x=>x.key==='graduate'))],[a+'Covers',r[a+'Top'].some(p=>p.budget.covers===true)],[a+'Titles',r[a+'Top'].map(p=>p.title).join(' · ')]])),priorAnyDegree:degree(r.priorSupported),afterAnyDegree:degree(r.afterSupported),priorBelowCap:!degree(r.priorTop)&&degree(r.priorSupported),afterBelowCap:!degree(r.afterTop)&&degree(r.afterSupported),gainedTop:r.gainedTop,lostTop:r.lostTop,gainedDegree:r.gainedDegree,lostDegree:r.lostDegree,gainedGraduate:r.gainedGraduate,lostGraduate:r.lostGraduate,gainedCovers:r.gainedCovers,lostCovers:r.lostCovers,changed:r.changed,newClaimCount:r.newSupported.length,reclassifiedCount:r.reclassified.length,reclassifiedTitles:r.reclassified.map(p=>p.title).join(' · '),offered:r.followups.length,positive:r.followups.filter(a=>a.selected.length).length,unknown:r.followups.filter(a=>!a.selected.length).length}))},
  evidence_claims071:{source,rows:d.claimCounts.map(c=>({id:c.id,title:c.title,routes:JSON.stringify(c.routes.map(r=>r.key)),models:c.models,development:c.development,holdout:c.holdout,holdout049:c.holdout049,holdout056:c.holdout056,amount:c.budgetExample.amount,payBasis:c.budgetExample.reason}))},
  evidence_scope071:{source,rows:[{id:'scope',...d.checks,freezeSHA256:d.freezeSHA256}]},
  evidence_questions071:{source,rows:d.questionCounts.map(q=>({id:q.id,prompt:q.prompt,kind:q.kind,choices:JSON.stringify([...q.options,...q.alternatives].map(o=>({id:o.id,text:o.text}))),...Object.fromEntries(['all','development','holdout','holdout049','holdout056'].flatMap(g=>[['Offered','offered'],['Positive','positive'],['Unknown','unknown']].map(([label,k])=>[g+label,q[g][k]])))}))}
 };
}
