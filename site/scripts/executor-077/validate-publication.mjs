// Independent publication checks: frozen population, categories and lossless case transport.
import{unpackCaseRows077}from'../../dist/executor-case-codec-077.js';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p));
const manifest=read('calibration/executor-077/manifest.json.gz');
const population=new Map(manifest.models.map(m=>[m.id,m]));
const hash=b=>createHash('sha256').update(b).digest('hex');
const degree=p=>p.routes.some(r=>['college','graduate'].includes(r.key));
const records=[];
for(const [kind,file] of [['full','executor-comparison-077.json.gz'],['targeted','targeted-executor-comparison-077.json.gz']].filter(([kind])=>!process.argv.includes('--targeted-only')||kind==='targeted')){
 const raw=read(`research/executor-077/${kind==='full'?'results':'targeted-results'}.json.gz`),pub=read('dist/developer/'+file);
 assert.equal(raw.rows.length,2000); assert.equal(pub.rows.length,2000);
 assert.deepEqual(pub.summary,raw.summary,'Public coverage summary changed');
 const hydrated=new Map();
 for(const part of pub.detailParts){
  const path='dist/developer/'+part.url.replace(/^\.\//,'');
  assert.equal(hash(fs.readFileSync(path)),part.sha256,'Detail checksum mismatch');
  const data=read(path); assert.equal(data.detailRunId,pub.detailRunId);if(data.careerEncoding==='career-pool-v1')unpackCaseRows077(data.rows,pub.careerDictionary);
  assert.deepEqual(data.rows.map(r=>r.id),part.models);
  for(const row of data.rows){
   assert.ok(!hydrated.has(row.id),'Duplicate case in public shards');
   for(const q of row.questionChanges||[])Object.assign(q,pub.questionDictionary[q.type+':'+q.questionId]);
   hydrated.set(row.id,row);
  }
 }
 assert.equal(hydrated.size,2000);
 for(const row of raw.rows){
  const m=population.get(row.id),p=hydrated.get(row.id),index=pub.rows.find(x=>x.id===row.id);
  assert.ok(m&&p&&index); assert.equal(row.cohort,m.cohort); assert.equal(row.name,m.name);
  assert.equal(index.cohort,row.cohort);
  const expectedRoutes=new Set(['simulator','grok'].flatMap(a=>['top','supported','other','sustaining','candidates','followups'].flatMap(c=>row[a][c]||[])).flatMap(p=>p.routes.map(x=>x.key)));
  assert.deepEqual(new Set(index.educationKeys),expectedRoutes,'Education filter omitted an offered route');
  for(const arm of ['simulator','grok']){
   assert.ok(row[arm].top.length<=3);
   for(const category of ['top','supported','other','sustaining','candidates','followups']){
    const ps=row[arm][category]||[],actual=p[arm][category]||[];
    assert.deepEqual(actual.map(x=>x.id),ps.map(x=>x.id),row.id+' '+arm+' '+category);
    assert.equal(new Set(ps.map(x=>x.id)).size,ps.length,'Duplicate career in category');
    for(let j=0;j<ps.length;j++){
     for(const key of Object.keys(ps[j]).filter(k=>!['earnings','sourceURL','qualitativeReview'].includes(k)))assert.deepEqual(actual[j][key],ps[j][key],row.id+' '+arm+' '+category+' '+key);
     assert.deepEqual(actual[j].budget,ps[j].budget);
     assert.deepEqual(actual[j].routes,ps[j].routes);
    }
   }
   const supported=new Set(row[arm].supported.map(x=>x.id));
   assert.ok(row[arm].top.every(x=>supported.has(x.id)));
   assert.equal(new Set([...row[arm].top,...row[arm].other].map(x=>x.id)).size,supported.size);
   assert.ok(row[arm].other.every(x=>!row[arm].top.some(t=>t.id===x.id)&&supported.has(x.id)));
   assert.ok(row[arm].candidates.every(x=>!supported.has(x.id)),'Candidate incorrectly counts as supported');
   assert.ok(row[arm].sustaining.every(x=>supported.has(x.id)&&x.budget.covers===true));
  }
  assert.deepEqual(p.questionChanges,row.questionChanges,'Answer dictionary transport lost question content');
  assert.deepEqual(index.simulator.top.map(x=>x.id),row.simulator.top.map(x=>x.id));
  assert.deepEqual(index.grok.top.map(x=>x.id),row.grok.top.map(x=>x.id));
 }
 for(const cohort of ['all','development','holdout','holdout049','holdout056','grok075']){
  const rs=raw.rows.filter(r=>cohort==='all'?r.cohort!=='grok075':r.cohort===cohort),s=raw.summary[cohort];
  assert.equal(rs.length,s.models);
  for(const arm of ['simulator','grok']){
   assert.equal(rs.filter(r=>r[arm].top.length).length,s[arm+'Top']);
   assert.equal(rs.filter(r=>r[arm].top.some(degree)).length,s[arm+'Degree']);
  }
 }
 assert.equal(raw.summary.development.models,758);
 assert.equal(raw.summary.holdout.models,30);
 assert.equal(raw.summary.holdout049.models,12);
 assert.equal(raw.summary.holdout056.models,200);
 if(kind==='full'){
  // Recompute frequency membership independently with sets of model IDs.
  for(const f of raw.frequencies){
   const rs=raw.rows.filter(r=>f.cohort==='all'?r.cohort!=='grok075':r.cohort===f.cohort);
   for(const arm of ['simulator','grok']){
    const ids=new Set(rs.filter(r=>r[arm][f.category].some(p=>f.kind==='career'?p.id===f.id:f.kind==='field'?p.fields.includes(f.id):p.routes.some(x=>x.key===f.id))).map(r=>r.id));
    assert.equal(ids.size,f[arm],f.kind+' frequency '+f.id);
   }
   assert.equal(f.delta,f.grok-f.simulator);
  }
  assert.deepEqual(pub.frequencies,raw.frequencies);
 }
 records.push({study:kind,models:raw.rows.length,losslessShards:pub.detailParts.length,holdoutSizes:[30,12,200],checks:'Frozen profile IDs; raw/public summary; full career/category order; budgets; education; exact question wording and options'+(kind==='full'?'; deduplicated category frequencies':'')});
}
const result={status:'passed',checkedAt:new Date().toISOString(),records};
fs.writeFileSync('research/executor-077/publication-validation.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
