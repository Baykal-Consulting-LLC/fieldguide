// Descriptive answer-executor diagnostics; never feeds answers or matching rules.
import fs from 'node:fs';import {gunzipSync} from 'node:zlib';
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p));
const result=read('research/executor-077/results.json.gz'),manifest=read('calibration/executor-077/manifest.json.gz'),answers=new Map(read('calibration/executor-077/answers.json.gz').map(r=>[r.id,r.answers])),byId=new Map(manifest.models.map(m=>[m.id,m]));
const groups=['all','development','holdout','holdout049','holdout056','grok075'];
const diagnostics={method:'Descriptive paired comparisons. No population inference, calibration or answer selection. Existing answer codes and Grok codes refer to the same frozen item exposure.',cohorts:{}};
for(const cohort of groups){const rs=result.rows.filter(r=>cohort==='all'?r.cohort!=='grok075':r.cohort===cohort),types={},agreement={exactNonempty:0,partialOverlap:0,disjointNonempty:0,existingOnly:0,grokOnly:0,bothEmpty:0};
 for(const r of rs){const old=new Set(r.simulator.top.map(p=>p.id)),next=new Set(r.grok.top.map(p=>p.id)),n=[...old].filter(x=>next.has(x)).length;
  agreement[!old.size&&!next.size?'bothEmpty':!next.size?'existingOnly':!old.size?'grokOnly':r.exactTopSet?'exactNonempty':n?'partialOverlap':'disjointNonempty']++;
  const model=byId.get(r.id),a=answers.get(r.id);
  for(let i=0;i<model.questions.length;i++){const k=model.questions[i],q=manifest.definitions[k],before=model.baseline[i],raw=a[String(k)],after=q.kind==='official'&&raw===0?3:raw,group=q.kind==='official'?'Broad interest items':q.type==='specific'?'Profession-specific checks':q.type==='rating'?'Interest facets':'Activity choices',s=types[group]??={responses:0,changed:0,rawChanged:0,existingUnknown:0,grokUnknown:0,unknownToYes:0,yesToUnknown:0,noToYes:0,yesToNo:0};s.responses++;s.changed+=before!==after;s.rawChanged+=before!==raw;s.existingUnknown+=before===0;s.grokUnknown+=raw===0;
   if(q.type==='specific'){s.unknownToYes+=before===0&&after===1;s.yesToUnknown+=before===1&&raw===0;s.noToYes+=before===2&&after===1;s.yesToNo+=before===1&&after===2;}
  }
 }
 const freq=(kind)=>result.frequencies.filter(f=>f.cohort===cohort&&f.kind===kind&&f.category==='top').sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)).slice(0,15);
 diagnostics.cohorts[cohort]={models:rs.length,agreement,types,largestCareerChanges:freq('career'),largestFieldChanges:freq('field'),education:result.frequencies.filter(f=>f.cohort===cohort&&f.kind==='education'&&f.category==='top')};
}
fs.writeFileSync('research/executor-077/diagnostics.json',JSON.stringify(diagnostics,null,2));fs.writeFileSync('dist/developer/executor-diagnostics-077.json',JSON.stringify(diagnostics));console.log(JSON.stringify(diagnostics,null,2));
