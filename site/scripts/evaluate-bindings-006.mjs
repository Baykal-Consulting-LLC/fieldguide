// Development-only rehearsal. Never reads an individual holdout or overwrites released cases.
import fs from'node:fs';import{gunzipSync}from'node:zlib';
import{explorerResults,explorerCareerQuestions,explorerFieldQuestions}from'../dist/open-explorer.js';
import{saveExplorerAnswer}from'../dist/explorer-053-state.js';
import{reflection}from'../calibration/cohort-056/response-policy.mjs';
import{isActivityChoice,relevantCareers}from'../calibration/cohort-056/replay-policy.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),profiles=read('calibration/cohort-056/profiles.json').filter(p=>p.phase==='development056'),bindings=read('calibration/cohort-056/question-bindings.json'),out=[];
const counts=rows=>({models:rows.length,top:rows.filter(r=>r.length).length,degreeTop:rows.filter(r=>r.some(p=>p.degree)).length});
for(const p of profiles){
 const c=JSON.parse(gunzipSync(fs.readFileSync('validation/cohort-056/'+p.id+'.json.gz'))),s=structuredClone(c.experimentState),before=explorerResults(s).rows.filter(r=>r.specific.supported).slice(0,3);
 s.explorer053.fieldAnswers={};s.explorer053.professionAnswers={};s.explorer053.history=s.explorer053.history.filter(a=>a.kind==='facet');
 const save=(kind,scope,q,payload)=>saveExplorerAnswer(s,{kind,scope,questionId:q.id,payload,at:'2026-10-20T22:00:00.000Z'});
 const task=(field,q)=>{if(s.explorer053.fieldAnswers[field]?.[q.id])return;const selected=q.options.filter(o=>reflection(p,bindings.options[o.id]).response==='yes').map(o=>o.id);save('field',field,q,{selected,confidence:selected.length?'medium':'low',source:'profile-inferred',evidence:'Explicit frozen activity and method IDs; development rehearsal.',...(selected.length?{}:{feedback:'unfamiliar'})});};
 for(const f of p.selectedFields)for(const q of explorerFieldQuestions(f))task(f,q);
 for(const r of relevantCareers(explorerResults(s).rows,p,bindings))for(const q of explorerCareerQuestions(r.id)){if(isActivityChoice(q))task(q.field||r.fields[0],q);else save('profession',r.id,q,reflection(p,bindings.questions[q.id]));}
 const rs=explorerResults(s).rows,after=rs.filter(r=>r.specific.supported).slice(0,3),compact=r=>({id:r.id,title:r.o.title,degree:r.degree,r:r.r});
 out.push({id:p.id,name:p.name,before:before.map(compact),after:after.map(compact),newTop:after.filter(r=>!before.some(b=>b.id===r.id)).map(compact),lostTop:before.filter(r=>!after.some(a=>a.id===r.id)).map(compact),allSupportedDegree:rs.some(r=>r.specific.supported&&r.degree),positiveTopics:p.positiveTopics,positiveMethods:p.positiveMethods,responsibilities:p.responsibilities});
}
const report={classification:'Development-only rehearsal; same first-three Top definition and frozen profiles. Authored simulation assumptions, not independently validated match accuracy.',before:counts(out.map(r=>r.before)),after:counts(out.map(r=>r.after)),gainedTop:out.filter(r=>!r.before.length&&r.after.length).length,lostAllTop:out.filter(r=>r.before.length&&!r.after.length).length,gainedDegree:out.filter(r=>!r.before.some(p=>p.degree)&&r.after.some(p=>p.degree)).length,lostDegree:out.filter(r=>r.before.some(p=>p.degree)&&!r.after.some(p=>p.degree)).length,allSupportedDegree:out.filter(r=>r.allSupportedDegree).length,rows:out};
fs.writeFileSync('validation/cohort-056/development-bindings-006.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,rows:undefined}));
