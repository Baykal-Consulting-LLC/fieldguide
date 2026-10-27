import fs from 'node:fs';import {createHash} from 'node:crypto';
import {careerComparisonOptions} from '../dist/career-comparisons.js';import {careerCheckSpec} from '../dist/career-check-questions.js';
const sha=x=>createHash('sha256').update(x).digest('hex'),publicRows=[];
for(const phase of ['development','holdout','supplement','legacy'])for(const r of JSON.parse(fs.readFileSync('validation/blind-2026-10-18/'+phase+'-summary.json')).students)publicRows.push(JSON.parse(fs.readFileSync('validation/blind-2026-10-18/'+r.id+'.json')));
const privateRows=JSON.parse(fs.readFileSync('../private-student-models/website-cases.json')).rows,packets=[],manifests=[];
for(const c of [...publicRows,...privateRows]){
 const offered=careerComparisonOptions(c.experimentState).rows.slice(0,3),questions=new Map();
 const comparisons=offered.map(r=>{const spec=careerCheckSpec(r.id);for(const q of spec.questions){if(questions.has(q.id))continue;const existing=c.experimentState.profileJourney.depth?.[spec.family]?.[q.id];questions.set(q.id,{family:spec.family,id:q.id,prompt:q.prompt,options:q.options.map(o=>({id:o.id,text:o.text})),...(Array.isArray(existing)?{existing:[...existing]}:{})});}return {id:r.id,family:spec.family,questionIds:spec.questions.map(q=>q.id)};});
 const manifest={id:c.id,sourceSHA256:sha(JSON.stringify(c)),biographySHA256:sha(JSON.stringify(c.biography)),comparisons,questions:[...questions.values()]};manifests.push(manifest);
 if(questions.size)packets.push({id:c.id,biography:c.biography,questions:[...questions.values()].filter(q=>!('existing'in q))});
}
const out='../analysis/profession-replay-041';fs.writeFileSync('research/profession-replay-041/offered-manifest.json',JSON.stringify({version:'0.41.0',scope:'Initial up to three offered comparisons per model. Existing answers are reused exactly; only missing work answers are inferred.',rows:manifests.filter(r=>!r.id.startsWith('private-'))},null,2)+'\n');
fs.writeFileSync(out+'/private-manifest.json',JSON.stringify(manifests.filter(r=>r.id.startsWith('private-')),null,2)+'\n');
const batches=[[],[],[]];packets.forEach((p,i)=>batches[i%3].push(p));for(let i=0;i<3;i++)fs.writeFileSync(out+'/author-'+(i+1)+'.json',JSON.stringify(batches[i],null,2)+'\n');
console.log({models:manifests.length,comparisons:manifests.reduce((n,m)=>n+m.comparisons.length,0),questions:manifests.reduce((n,m)=>n+m.questions.length,0),newAnswers:packets.reduce((n,p)=>n+p.questions.length,0),batches:batches.map(b=>({models:b.length,newAnswers:b.reduce((n,p)=>n+p.questions.length,0)}))});
