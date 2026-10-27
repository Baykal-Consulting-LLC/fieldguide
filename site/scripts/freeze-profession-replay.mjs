import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='../analysis/profession-replay-041',sha=x=>createHash('sha256').update(x).digest('hex');
const publicManifest=JSON.parse(fs.readFileSync('research/profession-replay-041/offered-manifest.json')),privateManifest=JSON.parse(fs.readFileSync(root+'/private-manifest.json')),byId=new Map(),authorById=new Map();
for(let i=1;i<=3;i++){
 const input=JSON.parse(fs.readFileSync(root+'/author-'+i+'.json')),output=JSON.parse(fs.readFileSync(root+'/answers-'+i+'.json'));assert.equal(output.length,input.length);
 assert.equal(new Set(output.map(r=>r.id)).size,output.length);
 for(const model of input){const row=output.find(r=>r.id===model.id);assert.ok(row,model.id);assert.equal(row.answers.length,model.questions.length);assert.equal(new Set(row.answers.map(a=>a.questionId)).size,row.answers.length);
  for(const q of model.questions){const a=row.answers.find(a=>a.questionId===q.id);assert.ok(a,q.id);assert.ok(Array.isArray(a.selected));assert.equal(new Set(a.selected).size,a.selected.length);assert.ok(a.selected.every(id=>q.options.some(o=>o.id===id)),q.id);assert.ok(['high','medium','low'].includes(a.confidence));assert.ok(typeof a.evidence==='string'&&a.evidence.trim().length>=15);assert.ok(a.selected.length?a.feedback===null:['unfamiliar','not-interested','unsure'].includes(a.feedback));}
  assert.ok(!byId.has(model.id));byId.set(model.id,row);authorById.set(model.id,'profile-only-author-'+i);
 }
}
const provenance='Additional answers inferred from the frozen fictional biography by a separate author shown only that biography and the question/option text. Existing answers reused exactly. Uncertainty retained. Answers frozen before final matching; no career choice is implied.';
const rows=[...publicManifest.rows,...privateManifest].map(m=>{const a=byId.get(m.id),answers=m.questions.map(q=>{
 const existing='existing'in q,authored=a?.answers.find(a=>a.questionId===q.id);assert.ok(existing||authored,m.id+' '+q.id);const selected=existing?q.existing:authored.selected;
 return {family:q.family,questionId:q.id,prompt:q.prompt,selected:[...selected],selectedTexts:selected.map(id=>q.options.find(o=>o.id===id).text),feedback:existing?null:authored.feedback,confidence:existing?'original':authored.confidence,evidence:existing?'Preserved from the original frozen work-answer history; no new inference or replacement.':authored.evidence,source:existing?'original-answer':'profile-inferred'};
 });const replay={id:m.id,version:1,author:authorById.get(m.id)||'no-new-questions',provenance,sourceSHA256:m.sourceSHA256,biographySHA256:m.biographySHA256,comparisons:m.comparisons,answers};replay.answerSHA256=sha(JSON.stringify(replay));return replay;});
const publicRows=rows.filter(r=>!r.id.startsWith('private-')),privateRows=rows.filter(r=>r.id.startsWith('private-'));
const out={version:'0.41.0',classification:provenance,rows:publicRows};const file='research/profession-replay-041/answers.json',serialized=JSON.stringify(out,null,2)+'\n';
if(fs.existsSync(file))assert.equal(fs.readFileSync(file,'utf8'),serialized,'Previously frozen answers cannot be replaced.');else fs.writeFileSync(file,serialized);
fs.writeFileSync(root+'/private-replays.json',JSON.stringify(privateRows,null,2)+'\n');
const counts={publicModels:publicRows.length,privateModels:privateRows.length,publicComparisons:publicRows.reduce((n,m)=>n+m.comparisons.length,0),publicNewAnswers:publicRows.flatMap(r=>r.answers).filter(a=>a.source==='profile-inferred').length,publicReusedAnswers:publicRows.flatMap(r=>r.answers).filter(a=>a.source==='original-answer').length};
fs.writeFileSync('research/profession-replay-041/answer-freeze.json',JSON.stringify({version:'0.41.0',frozenAt:new Date().toISOString(),answersSHA256:sha(serialized),manifestSHA256:sha(fs.readFileSync('research/profession-replay-041/offered-manifest.json')),counts,provenance},null,2)+'\n');console.log(counts);
